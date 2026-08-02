import { StyleSheet, Text, View, Button, Image, TouchableOpacity, ScrollView} from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import CoinDisplay from '../components/CoinDisplay';
import MiniLeaderboard from '../components/MiniLeaderboard';
import AvatarPreview from '../components/AvatarPreview';
import { supabase } from '../lib/supabase';
import CorrectCountDisplay from '../components/CorrectCountDisplay';


export default function PracticeHub() {
  const router = useRouter();
  const [avatarRefresh, setAvatarRefresh] = useState(0);
  const [coinRefresh, setCoinRefresh] = useState(0);

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

      {/* Math + English side by side */}
      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.sectionTitle}>Math</Text>
          <View style={styles.difficultyRow}>
            <TouchableOpacity
              style={styles.fillButton}
              onPress={() => router.push('/Math?difficulty=easy')}
            >
              <Text style={styles.buttonText}>EASY</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.fillButton}
              onPress={() => router.push('/Math?difficulty=medium')}
            >
              <Text style={styles.buttonText}>MEDIUM</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.fillButton}
              onPress={() => router.push('/Math?difficulty=hard')}
            >
              <Text style={styles.buttonText}>HARD</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.column}>
          <Text style={styles.sectionTitle}>English</Text>
          <View style={styles.difficultyRow}>
            <TouchableOpacity
              style={styles.fillButton}
              onPress={() => router.push('/English?difficulty=easy')}
            >
              <Text style={styles.buttonText}>EASY</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.fillButton}
              onPress={() => router.push('/English?difficulty=medium')}
            >
              <Text style={styles.buttonText}>MEDIUM</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.fillButton}
              onPress={() => router.push('/English?difficulty=hard')}
            >
              <Text style={styles.buttonText}>HARD</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Leaderboard + Profile side by side */}
      <View style={styles.bottomRow}>
        <View style={styles.leaderboardColumn}>
          <Text style={styles.title}>Leaderboard</Text>
          <MiniLeaderboard />
        </View>

        <View style={styles.profileColumn}>
          <Text style={styles.title}>Profile</Text>
          <View style={styles.shopRow}>
            <CorrectCountDisplay refreshKey={avatarRefresh} fontSize={28} />
              <Text style={{ fontSize: 28, marginVertical: 10, color: '#4d3b2c' }}> | </Text>
              <CoinDisplay fontSize={28}/>
            <TouchableOpacity style={styles.shopButton} onPress={() => router.push('/Shop')}>
              <Text style={styles.shopButtonText}>Shop</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.feedbackButton} onPress={() => router.push('/Feedback')}>
              <Text style={styles.shopButtonText}>Feedback Form</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <View style={styles.avatar}>
               <AvatarPreview refreshKey={avatarRefresh} size={350} />
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={true} style={styles.inventoryScroll}>
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
                    <Text style={styles.itemName}>{item.name}</Text>
                    <TouchableOpacity style={styles.button} onPress={() => handleEquip(item)}>
                      <Text style={styles.buttonText}>{isEquipped ? 'Unequip' : 'Equip'}</Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
            </ScrollView>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
  flex: 1,
  backgroundColor: '#FFE787',
  alignItems: 'stretch', // changed from 'center'
  justifyContent: 'flex-start', // changed from 'center'
  padding: 20,
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
  maxWidth: 600,
  marginRight: 50,
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
    paddingVertical: 10,
    borderRadius: 6,
    marginVertical: 5,
    width: 200,
    alignItems: 'center',
  },

  buttonText: {
    color: 'white',
    fontSize: 50,
  },
  shopRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginVertical: 10,
    width: '90%',
  },
  shopButton: {
    backgroundColor: '#A7C7E7',
    paddingVertical: 10,
    borderRadius: 6,
    width: 90,
    alignItems: 'center',
    marginLeft: 20,
  },
  feedbackButton: {
    backgroundColor: '#A7C7E7',
    paddingVertical: 10,
    borderRadius: 6,
    width: 220,
    alignItems: 'center',
    marginLeft: 20,
  },
  shopButtonText: {
    color: 'white',
    fontSize: 28,
  },
inventoryList: {
  flexDirection: 'row',
  gap: 15,
},
inventoryItem: {
  backgroundColor: '#fff',
  borderRadius: 8,
  padding: 8,
  alignItems: 'center',
  width: 250,
  height: 250,
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
avatar:{
  marginTop: -100,
},
itemName: {
  fontSize: 20,
  marginVertical: 10,
  color: '#4d3b2c',
},
});