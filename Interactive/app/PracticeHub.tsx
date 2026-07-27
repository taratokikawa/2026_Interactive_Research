import { StyleSheet, Text, View, Button, Image, TouchableOpacity, } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import CoinDisplay from '../components/CoinDisplay';
import MiniLeaderboard from '../components/MiniLeaderboard';
import AvatarPreview from '../components/AvatarPreview';
import { supabase } from '../lib/supabase';


export default function PracticeHub() {
  const router = useRouter();
  const [avatarRefresh, setAvatarRefresh] = useState(0);

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

  type ShopItem = {
    id: string;
    name: string;
    type: 'shirt' | 'hat';
    price: number;
    preview_image_key: string;
    worn_image_key: string;
  };

  const [inventoryItems, setInventoryItems] = useState<ShopItem[]>([]);
  const [equippedShirtId, setEquippedShirtId] = useState<string | null>(null);
  const [equippedHatId, setEquippedHatId] = useState<string | null>(null);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;

    const { data: inventory } = await supabase
      .from('user_inventory')
      .select('item_id, shop_items(*)')
      .eq('user_id', userData.user.id);

    const items = inventory?.map((i: any) => i.shop_items) ?? [];
    setInventoryItems(items);

    const { data: avatar } = await supabase
      .from('user_avatar')
      .select('equipped_shirt, equipped_hat')
      .eq('user_id', userData.user.id)
      .single();

    setEquippedShirtId(avatar?.equipped_shirt ?? null);
    setEquippedHatId(avatar?.equipped_hat ?? null);
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

    setAvatarRefresh((prev) => prev + 1); 
  };

  return (
    <View style={styles.container}>
      
      <Text style={styles.title}>Practice Hub</Text>

      <View style={styles.row}>
        {/* Math Section */}
        <View style={styles.column}>
          <Text style={styles.sectionTitle}>Math</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/Math?difficulty=easy')}
          >
            <Text style={styles.buttonText}>EASY</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/Math?difficulty=medium')}
          >
            <Text style={styles.buttonText}>MEDIUM</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/Math?difficulty=hard')}
          >
            <Text style={styles.buttonText}>HARD</Text>
          </TouchableOpacity>
        </View>

        {/* English Section */}
        <View style={styles.column}>
          <Text style={styles.sectionTitle}>English</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/English?difficulty=easy')}
          >
            <Text style={styles.buttonText}>EASY</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/English?difficulty=medium')}
          >
            <Text style={styles.buttonText}>MEDIUM</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/English?difficulty=hard')}
          >
            <Text style={styles.buttonText}>HARD</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.title}>Leaderboard</Text>
              <MiniLeaderboard />

      <Text style={styles.title}>Profile</Text>
      <CoinDisplay />

      <View style={styles.row}>
        <AvatarPreview refreshKey={avatarRefresh} />

        <View style={styles.inventoryList}>
          {inventoryItems.map((item) => {
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
                <Text>{item.name}</Text>
                <TouchableOpacity style={styles.button} onPress={() => handleEquip(item)}>
                  <Text style={styles.buttonText}>{isEquipped ? 'Unequip' : 'Equip'}</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </View>

      <Button title="Shop" onPress={() => router.push('/Shop')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFE787',
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    fontSize: 40,
    color: 'white',
    marginVertical: 20,
    fontWeight: 'bold',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },

  column: {
    alignItems: 'center',
  },

  button: {
    backgroundColor: '#A7C7E7',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 6,
    marginVertical: 5,
    minWidth: 100,
    alignItems: 'center',
  },

  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
inventoryList: {
  flexDirection: 'row',
  gap: 8,
},
inventoryItem: {
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 8,
  padding: 8,
  alignItems: 'center',
  width: 90,
},
itemImage: {
  width: 80,
  height: 40,
  marginBottom: 4,
},
placeholderImage: {
  width: 80,
  height: 40,
  marginBottom: 4,
  backgroundColor: '#eee',
},
});