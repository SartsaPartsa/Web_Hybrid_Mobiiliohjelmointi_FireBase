// App.tsx
import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ListRenderItem } from "react-native";

import { db } from "./firebaseConfig";
import { collection, addDoc, onSnapshot, updateDoc, deleteDoc, doc } from "firebase/firestore";

interface Task {
  id: string;
  title: string;
  assignedTo: string;
  status: "Kesken" | "Tehty";
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState<string>("");
  const [assignedTo, setAssignedTo] = useState<string>("");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editTitle, setEditTitle] = useState<string>("");
  const [editAssignedTo, setEditAssignedTo] = useState<string>("");

  // Haetaan / kuunnellaan "tasks"-kokoelmaa
  useEffect(() => {
    const tasksRef = collection(db, "tasks");

    const unsubscribe = onSnapshot(tasksRef, (snapshot) => {
      const data: Task[] = [];
      snapshot.forEach((docSnap) => {
        data.push({
          id: docSnap.id,
          ...docSnap.data()
        } as Task);
      });
      setTasks(data);
    });

    return () => unsubscribe();
  }, []);

  // Lisää uusi kotityö
  const handleAddTask = async (): Promise<void> => {
    const t = title.trim();
    const a = assignedTo.trim();

    if (!t) {
      return;
    }

    try {
      await addDoc(collection(db, "tasks"), {
        title: t,
        assignedTo: a || "",
        status: "Kesken"
      });

      setTitle("");
      setAssignedTo("");
    } catch (error) {
      console.log("Virhe lisättäessä kotityötä:", error);
    }
  };

  // Vaihda status Kesken ↔ Tehty
  const handleToggleStatus = async (task: Task): Promise<void> => {
    const newStatus = task.status === "Tehty" ? "Kesken" : "Tehty";

    try {
      await updateDoc(doc(db, "tasks", task.id), {
        status: newStatus
      });
    } catch (error) {
      console.log("Virhe statusta vaihtaessa:", error);
    }
  };

  // Poista kotityö
  const handleDeleteTask = async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, "tasks", id));
    } catch (error) {
      console.log("Virhe poistaessa kotityötä:", error);
    }
  };

  const renderItem: ListRenderItem<Task> = ({ item }) => (
    <View style={styles.taskItem}>
      <View style={{ flex: 1 }}>
        <Text style={styles.taskTitle}>{item.title}</Text>
        {!!item.assignedTo && (
          <Text style={styles.taskAssigned}>Tekijä: {item.assignedTo}</Text>
        )}
        <Text style={styles.taskStatus}>
          Tila: {item.status || "Kesken"}
        </Text>
      </View>

      <View style={styles.taskButtons}>
        <TouchableOpacity
          style={[styles.smallButton, { backgroundColor: "#34C759" }]}
          onPress={() => {
            setEditingTask(item);
            setEditTitle(item.title);
            setEditAssignedTo(item.assignedTo || "");
          }}
        >
          <Text style={styles.smallButtonText}>Muokkaa</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.smallButton, styles.toggleButton]}
          onPress={() => handleToggleStatus(item)}
        >
          <Text style={styles.smallButtonText}>
            {item.status === "Tehty" ? "Kesken" : "Tehty"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.smallButton, styles.deleteButton]}
          onPress={() => handleDeleteTask(item.id)}
        >
          <Text style={styles.smallButtonText}>Poista</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.header}>Kotityöt</Text>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Kotityön nimi (esim. Imurointi)"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={styles.input}
            placeholder="Tekijä (esim. Mikko) – valinnainen"
            value={assignedTo}
            onChangeText={setAssignedTo}
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
            <Text style={styles.addButtonText}>Lisää kotityö</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.listTitle}>Kotityölista</Text>

        {editingTask && (
          <View style={styles.form}>
            <Text style={{ fontWeight: "700", marginBottom: 8 }}>
              Muokataan: {editingTask.title}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Kotityön nimi"
              value={editTitle}
              onChangeText={setEditTitle}
            />

            <TextInput
              style={styles.input}
              placeholder="Tekijä"
              value={editAssignedTo}
              onChangeText={setEditAssignedTo}
            />

            <TouchableOpacity
              style={styles.addButton}
              onPress={async () => {
                try {
                  await updateDoc(doc(db, "tasks", editingTask.id), {
                    title: editTitle,
                    assignedTo: editAssignedTo
                  });
                  setEditingTask(null);
                  setEditTitle("");
                  setEditAssignedTo("");
                } catch (err) {
                  console.log("Virhe päivitettäessä:", err);
                }
              }}
            >
              <Text style={styles.addButtonText}>Tallenna muutokset</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: "#999", marginTop: 6 }]}
              onPress={() => setEditingTask(null)}
            >
              <Text style={styles.addButtonText}>Peruuta</Text>
            </TouchableOpacity>
          </View>
        )}

        {tasks.length === 0 ? (
          <Text style={styles.emptyText}>
            Ei vielä kotitöitä. Lisää ensimmäinen yllä.
          </Text>
        ) : (
          <FlatList
            data={tasks}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    paddingTop: 50
  },
  container: {
    flex: 1,
    padding: 16
  },
  header: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 16
  },
  form: {
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    marginBottom: 8
  },
  addButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center"
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8
  },
  emptyText: {
    color: "#666",
    fontSize: 14
  },
  list: {
    paddingTop: 4
  },
  taskItem: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    flexDirection: "row"
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4
  },
  taskAssigned: {
    fontSize: 13,
    color: "#555",
    marginBottom: 4
  },
  taskStatus: {
    fontSize: 13,
    color: "#333"
  },
  taskButtons: {
    justifyContent: "space-between",
    marginLeft: 8
  },
  smallButton: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginBottom: 4,
    alignItems: "center"
  },
  smallButtonText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "600"
  },
  toggleButton: {
    backgroundColor: "#007AFF"
  },
  deleteButton: {
    backgroundColor: "#FF3B30"
  }
});
