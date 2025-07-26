import { icons } from "@/constants";
import { useLocationStore } from "@/store";
import { GoogleInputProps } from "@/types/types";
import { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const API_KEYS = [
  "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjFlZWQxZmJlZTZhYzQ2MWRhZGIxNGI2N2VlN2QzZDZmIiwiaCI6Im11cm11cjY0In0=",
  "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjAyMmQ5OTUyYWM5NjQxYmZiNjI0YmM1ZTJjNjQyNWEwIiwiaCI6Im11cm11cjY0In0=",
];

const GoogleTextInput = ({
  icon,
  initialLocation,
  containerStyle,
  textInputBackgroundColor,
  handlePress,
  style,
  onFocus,
  onBlur,
  showAutocomplete = true,
}: GoogleInputProps & {
  onFocus?: () => void;
  onBlur?: () => void;
  showAutocomplete?: boolean;
}) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceTimeout = useRef<number | null>(null);
  const { userLatitude, userLongitude } = useLocationStore();

  const handleTextChange = (text: string) => {
    setQuery(text);
    setLoading(true); // Mostrar spinner imediatamente após digitar qualquer caractere

    if (text.length < 1) {
      setResults([]);
      setLoading(false);
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
      return;
    }

    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(() => {
      performSearch(text);
    }, 400);
  };

  const performSearch = async (searchText: string) => {
    for (let key of API_KEYS) {
      const url = `https://api.openrouteservice.org/geocode/autocomplete?api_key=${key}&text=${encodeURIComponent(
        searchText
      )}&size=5`;

      try {
        const response = await fetch(url, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json; charset=utf-8",
          },
        });

        if (!response.ok) continue;

        const data = await response.json();

        const formatted = data.features.map((item: any) => ({
          place_id: item.properties.id || item.properties.label,
          display_name:
            item.properties.label || `${item.properties.name || ""}`,
          lat: item.geometry.coordinates[1],
          lon: item.geometry.coordinates[0],
        }));

        setResults(formatted);
        setLoading(false); // Ocultar spinner após resposta
        return;
      } catch (error) {
        continue;
      }
    }

    setLoading(false); // Ocultar spinner após erro também
    setResults([]);
  };

  const onSelect = (item: any) => {
    handlePress({
      latitude: parseFloat(item.lat),
      longitude: parseFloat(item.lon),
      address: item.display_name,
    });
    setQuery(item.display_name);
    setResults([]);
  };

  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  return (
    <View
      className={`relative ${containerStyle} mt-20`}
      style={[style, { zIndex: 50 }]}
    >
      <View
        className="flex-row items-center w-full bg-white rounded-2xl px-3"
        style={{ backgroundColor: textInputBackgroundColor || "white" }}
      >
        <Image
          source={icon ? icon : icons.search}
          className="w-6 h-6 mr-2"
          resizeMode="contain"
        />
        <TextInput
          placeholder={initialLocation ?? "Onde deseja ir hoje?"}
          placeholderTextColor="gray"
          value={query}
          onChangeText={handleTextChange}
          onFocus={onFocus}
          onBlur={onBlur}
          className="flex-1 py-5 text-base font-semibold"
        />
          {loading && (
            <View className="ml-2">
            <ActivityIndicator size="small" color="#888" />
            </View>
        )}
      </View>

      {showAutocomplete && results.length > 0 && (
        <FlatList
          data={results}
          keyExtractor={(item) => item.place_id.toString()}
          className="absolute top-12 w-full bg-white rounded-xl border max-h-[220px] mt-4 z-50"
          renderItem={({ item }) => {
            const [firstPart, ...restParts] = item.display_name.split(",");
            const rest = restParts.join(",");
            return (
              <TouchableOpacity
                onPress={() => onSelect(item)}
                className="px-4 py-3 border-b border-gray-200 bg-white"
              >
                <Text className="text-black font-JakartaLight">
                  <Text className="font-JakartaExtraBold">
                    {firstPart.trim()}
                  </Text>
                  {rest ? `,${rest}` : ""}
                </Text>
              </TouchableOpacity>
            );
          }}
          keyboardShouldPersistTaps="handled"
        />
      )}
    </View>
  );
};

export default GoogleTextInput;
