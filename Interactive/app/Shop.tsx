import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { supabase } from '../lib/supabase';
import CoinDisplay from '../components/CoinDisplay';
import AvatarPreview from '../components/AvatarPreview';

type ShopItem = {
  id: string;
  name: string;
  type: 'shirt' | 'hat';
  price: number;
  preview_image_key: string;
  worn_image_key: string;
};

const PREVIEW_IMAGES: Record<string, any> = {
  red_shirt: require('../assets/items/preview/red_shirt.png'),
  blue_shirt: require('../assets/items/preview/blue_shirt.png'),
  yellow_shirt: require('../assets/items/preview/yellow_shirt.png'),
  suit: require('../assets/items/preview/suit.png'),
  cap: require('../assets/items/preview/cap.png'),
  bow: require('../assets/items/preview/bow.png'),
  top_hat: require('../assets/items/preview/top_hat.png'),
  crown: require('../assets/items/preview/crown.png'),
  lab_coat: require('../assets/items/preview/lab_coat.png'),
  head_mirror: require('../assets/items/preview/head_mirror.png'),
};

export default function Shop() {
  const [items, setItems] = useState<ShopItem[]>([]);
  const [ownedIds, setOwnedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [coinRefresh, setCoinRefresh] = useState(0);
  const [message, setMessage] = useState('');
  const [avatarRefresh, setAvatarRefresh] = useState(0);
  const [equippedShirtId, setEquippedShirtId] = useState<string | null>(null);
  const [equippedHatId, setEquippedHatId] = useState<string | null>(null);

  useEffect(() => {
    fetchShopData();
  }, []);

  const fetchShopData = async () => {
    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;

    const { data: shopItems } = await supabase.from('shop_items').select('*');
    const { data: inventory } = await supabase
      .from('user_inventory')
      .select('item_id')
      .eq('user_id', userData.user.id);
    const { data: avatar } = await supabase
      .from('user_avatar')
      .select('equipped_shirt, equipped_hat')
      .eq('user_id', userData.user.id)
      .single();

    setEquippedShirtId(avatar?.equipped_shirt ?? null);
    setEquippedHatId(avatar?.equipped_hat ?? null);

    setItems(shopItems ?? []);
    setOwnedIds(inventory?.map((i) => i.item_id) ?? []);
    setLoading(false);
  };

  const handlePurchase = async (item: ShopItem) => {
    setMessage('');
    const { error } = await supabase.rpc('purchase_item', { p_item_id: item.id });
    if (error) {
      setMessage(error.message);
      return;
    }

    setOwnedIds((prev) => [...prev, item.id]);
    setCoinRefresh((prev) => prev + 1);
  };

  const handleEquip = async (item: ShopItem) => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;

    const field = item.type === 'shirt' ? 'equipped_shirt' : 'equipped_hat';
    const currentlyEquippedId = item.type === 'shirt' ? equippedShirtId : equippedHatId;
    const isCurrentlyEquipped = currentlyEquippedId === item.id;

    const newValue = isCurrentlyEquipped ? null : item.id;

    await supabase
      .from('user_avatar')
      .update({ [field]: newValue })
      .eq('user_id', userData.user.id);

    if (item.type === 'shirt') {
      setEquippedShirtId(newValue);
    } else {
      setEquippedHatId(newValue);
    }

    setMessage(isCurrentlyEquipped ? `Unequipped ${item.name}` : `Equipped ${item.name}!`);
    setAvatarRefresh((prev) => prev + 1);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }

  const shirts = items.filter((i) => i.type === 'shirt').sort((a, b) => a.price - b.price);
  const hats = items.filter((i) => i.type === 'hat').sort((a, b) => a.price - b.price);

  const renderItem = (item: ShopItem) => {
    const owned = ownedIds.includes(item.id);
    const isEquipped =
      (item.type === 'shirt' && equippedShirtId === item.id) ||
      (item.type === 'hat' && equippedHatId === item.id);

    return (
      <View key={item.id} style={styles.inventoryItem}>
        {PREVIEW_IMAGES[item.preview_image_key] ? (
          <Image source={PREVIEW_IMAGES[item.preview_image_key]} style={styles.itemImage} />
        ) : (
          <View style={styles.placeholderImage} />
        )}
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>{item.price} coins</Text>
        {owned ? (
          <TouchableOpacity style={styles.button} onPress={() => handleEquip(item)}>
            <Text style={styles.buttonText}>{isEquipped ? 'Unequip' : 'Equip'}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.button} onPress={() => handlePurchase(item)}>
            <Text style={styles.buttonText}>Buy</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Shop</Text>

      <View style={styles.shopMainRow}>
        <View style={styles.itemsColumn}>
          <Text style={styles.sectionTitle}>Shirts</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.inventoryScroll}>
            <View style={styles.inventoryList}>{shirts.map(renderItem)}</View>
          </ScrollView>

          <Text style={styles.sectionTitle}>Hats</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.inventoryScroll}>
            <View style={styles.inventoryList}>{hats.map(renderItem)}</View>
          </ScrollView>
        </View>

        <View style={styles.avatarColumn}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
            <CoinDisplay refreshKey={coinRefresh} fontSize={50} />
          </View>
          <AvatarPreview refreshKey={avatarRefresh} size={475} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFE787',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    padding: 20,
  },
  shopMainRow: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'flex-start',
  },
  itemsColumn: {
    marginLeft: 50,
    flex: 0.8,
  },
  avatarColumn: {
    marginTop: 100,
    flex: 0.3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  difficultyRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 20,
    marginBottom: 20,
  },
  fillButton: {
    backgroundColor: '#A7C7E7',
    paddingVertical: 30,
    width: 250,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leaderboardColumn: {
    flex: 0.4,
    alignItems: 'center',
  },
  profileColumn: {
    flex: 0.6,
    alignItems: 'center',
  },
  inventoryScroll: {
    width: '100%',
  },
  bottomRow: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 10,
  },
  bottomColumn: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 80,
    color: 'white',
    marginVertical: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    width: '100%',
  },
  sectionTitle: {
    fontSize: 50,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    textAlign: 'left',
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 25,
  },
  column: {
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#A7C7E7',
    paddingVertical: 15,
    borderRadius: 6,
    marginVertical: 5,
    width: 170,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 40,
  },
  shopRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginVertical: 10,
    width: '95%',
  },
  shopButton: {
    backgroundColor: '#A7C7E7',
    paddingVertical: 10,
    borderRadius: 6,
    width: 100,
    alignItems: 'center',
    marginLeft: 20,
  },
  shopButtonText: {
    color: 'white',
    fontSize: 20,
  },
  inventoryList: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 15,
  },
  inventoryItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    width: 230,
    height: 285,
  },
  itemImage: {
    width: 160,
    height: 80,
    marginVertical: 8,
  },
  placeholderImage: {
    width: 160,
    height: 80,
    marginVertical: 8,
    backgroundColor: '#eee',
  },
  itemName: {
    fontSize: 30,
    marginBottom: 4,
    color: '#4d3b2c',
  },
  itemPrice: {
    fontSize: 20,
    color: '#8a7f79',
    marginBottom: 8,
  },
});