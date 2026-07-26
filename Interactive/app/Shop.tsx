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

  const shirts = items.filter((i) => i.type === 'shirt');
  const hats = items.filter((i) => i.type === 'hat');

  const renderItem = (item: ShopItem) => {
    const owned = ownedIds.includes(item.id);
    const isEquipped =
      (item.type === 'shirt' && equippedShirtId === item.id) ||
      (item.type === 'hat' && equippedHatId === item.id);

    return (
      <View key={item.id} style={styles.itemBox}>
        {PREVIEW_IMAGES[item.preview_image_key] ? (
          <Image source={PREVIEW_IMAGES[item.preview_image_key]} style={styles.itemImage} />
        ) : (
          <View style={styles.placeholderImage} />
        )}
        <Text>{item.name}</Text>
        <Text>{item.price} coins</Text>
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
      <CoinDisplay refreshKey={coinRefresh} />
      <Text style={styles.title}>Shop</Text>

      {message ? <Text style={styles.message}>{message}</Text> : null}

      <Text style={styles.sectionTitle}>Shirts</Text>
      <View style={styles.row}>{shirts.map(renderItem)}</View>

      <Text style={styles.sectionTitle}>Hats</Text>
      <View style={styles.row}>{hats.map(renderItem)}</View>
      <AvatarPreview refreshKey={avatarRefresh} />
    </ScrollView>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 16,
    marginTop: 20,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  itemBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    width: 100,
  },
  itemImage: {
    width: 90,
    height: 50,
    marginBottom: 6,
  },
  placeholderImage: {
    width: 90,
    height: 50,
    marginBottom: 6,
    backgroundColor: '#eee',
  },
  button: {
    marginTop: 6,
    backgroundColor: '#0071BC',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
  },
  message: {
    marginBottom: 10,
    color: '#333',
  },
});