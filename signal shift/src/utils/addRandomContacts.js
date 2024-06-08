
import { faker } from "@faker-js/faker";
import { database } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

export async function generateRandomUsers(count = 10) {
    const contactsCollection = collection(database, "contacts");

    for (let i = 0; i < count; i++) {
        const randomUser = {
            id: faker.string.uuid(),
            displayName: faker.person.fullName(),
            email: faker.internet.email(),
            avatar: faker.image.avatar(),
            about: faker.lorem.sentence(),
            blocked: [],
        };

        try {
            await addDoc(contactsCollection, randomUser);
            console.log(`Added contact: ${randomUser.displayName}`);

            // await setDoc(doc(database, "userchats", randomUser.id), {
            //     chats: [],
            // });
        } catch (error) {
            console.error("Error adding contact: ", error);
        }
    }
}

