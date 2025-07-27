import {
  collection,
  getDocs,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  where,
} from "firebase/firestore";
import { deleteUser } from "firebase/auth";
import { db } from "../firebase/config";

const usersCollection = collection(db, "users");

// Get only users with Admin or Super Admin roles
const getAdmins = async () => {
  const q = query(
    usersCollection,
    where("role", "in", ["Admin", "Super Admin"])
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

const addAdmin = async (adminData) => {
  try {
    // Untuk role "Admin", struktur data sama seperti Super Admin + field password
    const dataToAdd = {
      createdAt: serverTimestamp(),
      email: adminData.email,
      fullName: adminData.fullName,
      lastLogin: null,
      role: adminData.role,
      status: adminData.status || "Aktif",
    };

    // Tambahkan password hanya untuk role "Admin" (bukan Super Admin)
    if (adminData.role === "Admin") {
      dataToAdd.password = adminData.password;
    }

    const docRef = await addDoc(usersCollection, dataToAdd);
    return { id: docRef.id, ...dataToAdd };
  } catch (error) {
    console.error("Error adding admin:", error);
    throw error;
  }
};

const updateAdmin = async (id, adminData) => {
  try {
    const adminDoc = doc(db, "users", id);

    // Struktur data yang akan diupdate (sesuai database structure)
    const dataToUpdate = {
      email: adminData.email,
      fullName: adminData.fullName,
      role: adminData.role,
      status: adminData.status,
    };

    // Tambahkan password hanya jika role adalah "Admin" dan password disediakan
    if (adminData.role === "Admin" && adminData.password) {
      dataToUpdate.password = adminData.password;
    }

    await updateDoc(adminDoc, dataToUpdate);
    return { id, ...dataToUpdate };
  } catch (error) {
    console.error("Error updating admin:", error);
    throw error;
  }
};

const deleteAdmin = async (id) => {
  const adminDoc = doc(db, "users", id);
  await deleteDoc(adminDoc);

  // Note: For Super Admin, you might also want to delete from Auth
  // This requires the user object which we don't have here
  // Consider implementing a more robust deletion strategy
};

const adminService = {
  getAdmins,
  addAdmin,
  updateAdmin,
  deleteAdmin,
};

export default adminService;
