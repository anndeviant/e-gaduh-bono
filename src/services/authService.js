import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updatePassword,
} from "firebase/auth";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../firebase/config";

const login = async (email, password) => {
  try {
    // Pertama, coba login dengan Firebase Auth (untuk Super Admin)
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (userDoc.exists()) {
        const userData = userDoc.data();
        // Update lastLogin untuk Super Admin
        await updateDoc(doc(db, "users", user.uid), {
          lastLogin: serverTimestamp(),
        });
        return { ...user, ...userData };
      }
    } catch (firebaseError) {
      // Jika Firebase Auth gagal, coba login collection-based (untuk Admin biasa)
      console.log("Firebase Auth failed, trying collection-based auth");
    }

    // Kedua, coba login dengan collection "users" (untuk Admin biasa)
    const usersCollection = collection(db, "users");
    const q = query(
      usersCollection,
      where("email", "==", email),
      where("role", "==", "Admin")
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error("Email atau password salah");
    }

    const adminDoc = querySnapshot.docs[0];
    const adminData = adminDoc.data();

    // Verifikasi password (plain text comparison untuk Admin)
    if (adminData.password !== password) {
      throw new Error("Email atau password salah");
    }

    // Update lastLogin untuk Admin
    await updateDoc(doc(db, "users", adminDoc.id), {
      lastLogin: serverTimestamp(),
    });

    // Return data yang compatible dengan Firebase user format
    return {
      uid: adminDoc.id,
      email: adminData.email,
      accessToken: `admin_${adminDoc.id}_${Date.now()}`, // Custom token for admin
      ...adminData,
    };
  } catch (error) {
    console.error("Login error:", error);
    throw new Error("Email atau password salah");
  }
};

const registerSuperAdmin = async (adminData) => {
  try {
    const { fullName, email, password } = adminData;

    // Langkah 1: Buat pengguna di Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Langkah 2: Siapkan data untuk disimpan di Firestore (sesuai struktur database)
    const newUserDocument = {
      createdAt: serverTimestamp(),
      email: email,
      fullName: fullName,
      lastLogin: null,
      role: "Super Admin",
      status: "Aktif",
      // Password TIDAK disimpan di Firestore untuk Super Admin
    };

    // Langkah 3: Simpan dokumen ke Firestore dengan ID dari UID pengguna
    await setDoc(doc(db, "users", user.uid), newUserDocument);

    // Langkah 4: Kembalikan data lengkap untuk ditampilkan di UI
    return {
      id: user.uid,
      ...newUserDocument,
    };
  } catch (error) {
    console.error("Error registering super admin:", error);
    throw error;
  }
};

const updateSuperAdmin = async (id, adminData, newPassword = null) => {
  try {
    // Update Firestore document (sesuai struktur database)
    const userDoc = doc(db, "users", id);
    const dataToUpdate = {
      email: adminData.email,
      fullName: adminData.fullName,
      role: adminData.role,
      status: "Aktif", // Selalu "Aktif", bukan dari form
      // Password tidak pernah disimpan di Firestore untuk Super Admin
    };

    await updateDoc(userDoc, dataToUpdate);

    // If password needs to be updated, update in Auth
    if (newPassword) {
      // Note: This requires the user to be currently authenticated
      // You might need to implement re-authentication flow
      const currentUser = auth.currentUser;
      if (currentUser && currentUser.uid === id) {
        await updatePassword(currentUser, newPassword);
      }
    }

    return { id, ...dataToUpdate };
  } catch (error) {
    console.error("Error updating super admin:", error);
    throw error;
  }
};

const deleteSuperAdmin = async (id) => {
  try {
    // Delete from Firestore
    const userDoc = doc(db, "users", id);
    await deleteDoc(userDoc);

    // Note: Deleting from Auth requires the user object
    // This is complex because you can't delete other users from client
    // Consider implementing this on the backend/Cloud Functions
  } catch (error) {
    console.error("Error deleting super admin:", error);
    throw error;
  }
};

const authService = {
  login,
  registerSuperAdmin,
  updateSuperAdmin,
  deleteSuperAdmin,
};

export default authService;
