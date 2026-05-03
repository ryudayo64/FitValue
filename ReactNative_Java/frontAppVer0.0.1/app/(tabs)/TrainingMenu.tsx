import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";

type Screen = "menu" | "weight" | "reps";

interface Exercise {
  id: string;
  category: string;
  name: string;
}

interface SelectedExercise extends Exercise {
  order: number;
}

interface SetEntry {
  exercise: Exercise;
  weight: number;
  reps: number;
  time: string;
}

const MENU: Exercise[] = [
  { id: "bench", category: "胸", name: "ベンチプレス" },
  { id: "incline", category: "胸", name: "インクライン" },
  { id: "dips", category: "胸", name: "ディップス" },
  { id: "fly", category: "胸", name: "ダンベルフライ" },
  { id: "ohp", category: "肩", name: "オーバーヘッド" },
  { id: "lateral", category: "肩", name: "サイドレイズ" },
  { id: "front", category: "肩", name: "フロントレイズ" },
  { id: "curl", category: "腕", name: "バーベルカール" },
  { id: "hammer", category: "腕", name: "ハンマーカール" },
  { id: "tricep", category: "腕", name: "トライセプス" },
  { id: "crunch", category: "腹筋", name: "クランチ" },
  { id: "plank", category: "腹筋", name: "プランク" },
  { id: "legrise", category: "腹筋", name: "レッグレイズ" },
  { id: "deadlift", category: "背中", name: "デッドリフト" },
  { id: "pullup", category: "背中", name: "懸垂" },
  { id: "row", category: "背中", name: "ベントオーバー" },
  { id: "latpull", category: "背中", name: "ラットプルダウン" },
  { id: "squat", category: "脚", name: "スクワット" },
  { id: "legpress", category: "脚", name: "レッグプレス" },
  { id: "lunge", category: "脚", name: "ランジ" },
  { id: "legcurl", category: "脚", name: "レッグカール" },
];

const CATEGORIES = [{
  id: 1,
  name: "胸"
}, {
  id: 2,
  name: "肩"
}, {
  id: 3,
  name: "腕"
}, {
  id: 4,
  name: "腹筋"
}, {
  id: 5,
  name: "背中"
}, {
  id: 6,
  name: "脚"
}];

const CATEGORY_COLORS: Record<string, string> = {
  胸: "#ff6b6b",
  肩: "#ffa94d",
  腕: "#ffd43b",
  腹筋: "#69db7c",
  背中: "#4dabf7",
  脚: "#cc5de8",
};

const ITEM_H = 48;
const VISIBLE = 5;

interface WheelPickerProps {
  values: number[];
  value: number;
  onChange: (v: number) => void;
  unit: string;
}

function WheelPicker({ values, value, onChange, unit }: WheelPickerProps) {
  const scrollRef = useRef<ScrollView>(null);

  const currentIndex = Math.max(0, values.indexOf(value));

  const handleMomentumEnd = (
    e: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const y = e.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_H);
    const clamped = Math.max(0, Math.min(values.length - 1, index));
    onChange(values[clamped]);
  };

  return (
    <View style={styles.wheelWrap}>
      <View style={styles.wheelSelector} />

      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_H}
        decelerationRate="fast"
        onMomentumScrollEnd={handleMomentumEnd}
        contentOffset={{ x: 0, y: currentIndex * ITEM_H }}
        contentContainerStyle={{
          paddingTop: ITEM_H * Math.floor(VISIBLE / 2),
          paddingBottom: ITEM_H * Math.floor(VISIBLE / 2),
        }}
      >
        {values.map((v) => {
          const isCenter = v === value;

          return (
            <TouchableOpacity
              key={v}
              style={styles.wheelItem}
              onPress={() => onChange(v)}
            >
              <Text style={[styles.wheelNum, isCenter && styles.wheelNumActive]}>
                {v}
              </Text>
              {isCenter && <Text style={styles.wheelUnit}>{unit}</Text>}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

export default function TrainingMenu() {
  const [screen, setScreen] = useState<Screen>("menu");
  const [selectedMenus, setSelectedMenus] = useState<SelectedExercise[]>([]);
  const [activeCategory, setActiveCategory] = useState("胸");
  const [currentExIdx, setCurrentExIdx] = useState(0);
  const [weight, setWeight] = useState(60);
  const [reps, setReps] = useState(10);
  const [log, setLog] = useState<SetEntry[]>([]);
  const [flash, setFlash] = useState("");

  const lastWeights = useRef<Record<string, number>>({});

  const weights = useMemo(
    () => Array.from({ length: 200 }, (_, i) => i + 1),
    []
  );

  const repsList = useMemo(
    () => Array.from({ length: 100 }, (_, i) => i + 1),
    []
  );

  const currentExercise = selectedMenus[currentExIdx];

  const filteredMenu = MENU.filter((m) => m.category === activeCategory);

  const addMenu = useCallback((ex: Exercise) => {
    setSelectedMenus((prev) => {
      if (prev.find((e) => e.id === ex.id)) return prev;
      return [...prev, { ...ex, order: prev.length + 1 }];
    });
  }, []);

  const removeMenu = useCallback((id: string) => {
    setSelectedMenus((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const goToWeight = useCallback(
    (ex: Exercise) => {
      const idx = selectedMenus.findIndex((e) => e.id === ex.id);
      if (idx < 0) return;

      setCurrentExIdx(idx);

      const last = lastWeights.current[ex.id];
      if (last) setWeight(last);

      setScreen("weight");
    },
    [selectedMenus]
  );

  const showFlash = useCallback((msg: string) => {
    setFlash(msg);
    setTimeout(() => setFlash(""), 1200);
  }, []);

  const saveSet = useCallback(() => {
    if (!currentExercise) return;

    lastWeights.current[currentExercise.id] = weight;

    const entry: SetEntry = {
      exercise: currentExercise,
      weight,
      reps,
      time: new Date().toLocaleTimeString("ja-JP", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setLog((prev) => [entry, ...prev]);
    showFlash("保存しました ✓");
    setScreen("weight");
  }, [currentExercise, weight, reps, showFlash]);

  const lastW = currentExercise
    ? lastWeights.current[currentExercise.id]
    : undefined;

  if (screen === "weight" && currentExercise) {
    return (
      <View style={styles.root}>
        <View style={styles.bar}>
          <TouchableOpacity onPress={() => setScreen("menu")}>
            <Text style={styles.back}>← 戻る</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{currentExercise.name}</Text>
          <Text />
        </View>

        {lastW && (
          <TouchableOpacity
            style={styles.lastValue}
            onPress={() => setWeight(lastW)}
          >
            <Text>前回：{lastW}kg</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.pickerLabel}>重量</Text>

        <WheelPicker
          values={weights}
          value={weight}
          onChange={setWeight}
          unit="kg"
        />

        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => setScreen("reps")}
        >
          <Text style={styles.buttonText}>次へ：回数 →</Text>
        </TouchableOpacity>

        {flash !== "" && <Text style={styles.flash}>{flash}</Text>}
      </View>
    );
  }

  if (screen === "reps" && currentExercise) {
    return (
      <View style={styles.root}>
        <View style={styles.bar}>
          <TouchableOpacity onPress={() => setScreen("weight")}>
            <Text style={styles.back}>← 重量</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{currentExercise.name}</Text>
          <Text>{weight}kg</Text>
        </View>

        <Text style={styles.pickerLabel}>回数</Text>

        <WheelPicker
          values={repsList}
          value={reps}
          onChange={setReps}
          unit="rep"
        />

        <TouchableOpacity style={styles.saveButton} onPress={saveSet}>
          <Text style={styles.buttonText}>保存して次セットを記録する</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.subButton}
          onPress={() => setScreen("menu")}
        >
          <Text style={styles.subButtonText}>次の種目へ</Text>
        </TouchableOpacity>

        {flash !== "" && <Text style={styles.flash}>{flash}</Text>}
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <View style={styles.bar}>
        <Text style={styles.title}>FitValue</Text>
        <Text style={styles.date}>
          {new Date().toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "long",
            day: "numeric",
            weekday: "short",
          })}
        </Text>
      </View>

      <View style={styles.body}>
        <View style={styles.left}>
          <Text style={styles.sectionTitle}>決めたメニュー</Text>

          {selectedMenus.length === 0 ? (
            <Text style={styles.empty}>タップで追加▶︎</Text>
          ) : (
            <ScrollView>
              {selectedMenus.map((ex) => (
                <TouchableOpacity
                  key={ex.id}
                  style={[
                    styles.selectedItem,
                    { borderLeftColor: CATEGORY_COLORS[ex.category] },
                  ]}
                  onPress={() => goToWeight(ex)}
                >
                  <View>
                    <Text style={styles.selectedName}>{ex.name}</Text>
                    <Text style={styles.meta}>
                      {lastWeights.current[ex.id]
                        ? `${lastWeights.current[ex.id]}kg`
                        : ex.category}
                    </Text>
                  </View>

                  <TouchableOpacity onPress={() => removeMenu(ex.id)}>
                    <Text style={styles.remove}>×</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          {selectedMenus.length > 0 && (
            <TouchableOpacity
              style={styles.startButton}
              onPress={() => goToWeight(selectedMenus[0])}
            >
              <Text style={styles.buttonText}>開始 →</Text>
            </TouchableOpacity>
          )}
        </View>
        {/* 部位選択 */}
        <View style={styles.right}>
          <View style={styles.categoryWrap}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity 
              key={cat.id}
              style={[
                styles.categoryTab,
                activeCategory === cat.name && {
                  borderColor: CATEGORY_COLORS[cat.name],
                },
              ]}
                onPress={() => setActiveCategory(cat.name)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    activeCategory === cat.name && {
                      color: CATEGORY_COLORS[cat.name],
                    },
                  ]}
                >{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.line} />
          <ScrollView>
            {filteredMenu.map((ex) => {
              const added = selectedMenus.some((m) => m.id === ex.id);

              return (
                <TouchableOpacity
                  key={ex.id}
                  style={[styles.menuItem, added && styles.menuAdded]}
                  onPress={() => addMenu(ex)}
                >
                  <View
                    style={[
                      styles.dot,
                      { backgroundColor: CATEGORY_COLORS[ex.category] },
                    ]}
                  />
                  <Text style={styles.menuName}>{ex.name}</Text>
                  {added && <Text style={styles.check}>✓</Text>}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>

      {log.length > 0 && (
        <View style={styles.logBadge}>
          <Text style={styles.logBadgeText}>{log.length} sets</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#111827",
    paddingTop: 48,
    paddingHorizontal: 16,
  },
  bar: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    color: "#1e36ec",
    fontSize: 18,
    fontWeight: "700",
  },
  back: {
    color: "#93c5fd",
    fontSize: 14,
  },
  body: {
    flex: 1,
    flexDirection: "row",
    gap: 12,
  },
  left: {
    flex: 1,
    backgroundColor: "#1f2937",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
  },

  right: {
    flex: 1,
    backgroundColor: "#1f2937",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
  },
  sectionTitle: {
    color: "#fff",
    fontWeight: "700",
    marginBottom: 12,
  },
  empty: {
    color: "#9ca3af",
    marginTop: 24,
    textAlign: "center",
  },
  selectedItem: {
    backgroundColor: "#111827",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectedName: {
    color: "#fff",
    fontWeight: "700",
  },
  meta: {
    color: "#9ca3af",
    fontSize: 12,
    marginTop: 4,
  },
  remove: {
    color: "#f87171",
    fontSize: 20,
  },
  startButton: {
    backgroundColor: "#2563eb",
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
    alignItems: "center",
  },
  categoryScroll: {
    flexGrow: 0,
    maxHeight: 56,
  },
  categoryWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  //部位選択タブ
  categoryTab: {
    borderWidth: 1,
    borderColor: "#4b5563",
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 1,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5
  },
  categoryText: {
    color: "#d1d5db",
    fontWeight: "700",
  },
  menuItem: {
    backgroundColor: "#111827",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  menuAdded: {
    opacity: 0.5,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  menuName: {
    color: "#fff",
    flex: 1,
  },
  check: {
    color: "#22c55e",
    fontWeight: "700",
  },
  wheelWrap: {
    height: ITEM_H * VISIBLE,
    overflow: "hidden",
    marginVertical: 24,
    justifyContent: "center",
  },
  wheelSelector: {
    position: "absolute",
    top: ITEM_H * 2,
    left: 24,
    right: 24,
    height: ITEM_H,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  wheelItem: {
    height: ITEM_H,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  wheelNum: {
    color: "#9ca3af",
    fontSize: 22,
    fontWeight: "600",
  },
  wheelNumActive: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "800",
  },
  wheelUnit: {
    color: "#93c5fd",
    marginLeft: 6,
    fontWeight: "700",
  },
  pickerLabel: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 24,
  },
  lastValue: {
    backgroundColor: "#1f2937",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    marginTop: 16,
  },
  nextButton: {
    backgroundColor: "#2563eb",
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: "#16a34a",
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
  },
  subButton: {
    marginTop: 12,
    padding: 12,
    alignItems: "center",
  },
  subButtonText: {
    color: "#93c5fd",
    fontWeight: "700",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "800",
  },
  flash: {
    color: "#22c55e",
    textAlign: "center",
    marginTop: 16,
    fontWeight: "700",
  },
  logBadge: {
    position: "absolute",
    right: 16,
    bottom: 24,
    backgroundColor: "#2563eb",
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  logBadgeText: {
    color: "#fff",
    fontWeight: "700",
  },
  line: {
    height: 1,
    backgroundColor: "#374151",
    width: "100%",
    marginTop: 10,
    marginBottom: 10,
  },
  date: {
    color: "#fff",
    fontWeight: "700",
  }
});