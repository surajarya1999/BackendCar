const Contact = require("../model/contact");

class ContactController {
    // 📝 Create Contact (first time form submit)
    static async createContact(req, res) {
        try {
            const { name, email, phone, message } = req.body;

            if (!name || !email || !phone || !message) {
                return res.status(400).json({ message: "All fields are required" });
            }

            const newContact = new Contact({
                name,
                email,
                phone,
                message,
                chat: [{ text: message, sender: "user", createdAt: new Date() }],
                createdAt: new Date(),
            });

            await newContact.save();

            res.status(201).json({
                success: true,
                message: "Contact form submitted successfully",
                data: newContact,
            });
        } catch (error) {
            console.error("Error creating contact:", error);
            res.status(500).json({ success: false, message: "Server error", error });
        }
    }

    // 📄 Get All Contacts
    static async getContacts(req, res) {
        try {
            const contacts = await Contact.find().sort({ createdAt: -1 });
            res.status(200).json({
                success: true,
                message: "Contacts fetched successfully",
                data: contacts,
            });
        } catch (error) {
            console.error("Error fetching contacts:", error);
            res.status(500).json({ success: false, message: "Server error", error });
        }
    }

    // ➕ Add Message (chat continue)
    static async addMessage(req, res) {
        try {
            const { id } = req.params;
            const { text, sender } = req.body;

            if (!text || !sender) {
                return res.status(400).json({ message: "Text and sender are required" });
            }

            const contact = await Contact.findById(id);
            if (!contact) {
                return res.status(404).json({ message: "Contact not found" });
            }

            contact.chat.push({ text, sender, createdAt: new Date() });

            await contact.save();

            res.status(200).json({
                success: true,
                message: "Message added successfully",
                chat: contact.chat,
            });
        } catch (err) {
            console.error("Error adding message:", err);
            res.status(500).json({ message: "Server error" });
        }
    }

    // ✉️ Admin Reply (shortcut — internally bhi addMessage jaisa hi hai)
    static async replyToContact(req, res) {
        try {
            const { id } = req.params;
            const { reply } = req.body;

            if (!reply) {
                return res.status(400).json({ message: "Reply is required" });
            }

            const contact = await Contact.findById(id);
            if (!contact) {
                return res.status(404).json({ message: "Contact not found" });
            }

            // reply bhi chat me push hoga as "admin"
            contact.chat.push({ text: reply, sender: "admin", createdAt: new Date() });

            await contact.save();

            res.status(200).json({
                success: true,
                message: "Reply sent successfully",
                chat: contact.chat,
            });
        } catch (error) {
            console.error("Error replying to contact:", error);
            res.status(500).json({ message: "Server error", error });
        }
    }

    // ❌ Delete Contact
    static async deleteContact(req, res) {
        try {
            const { id } = req.params;
            await Contact.findByIdAndDelete(id);

            res.status(200).json({
                success: true,
                message: "Contact deleted successfully",
            });
        } catch (error) {
            console.error("Error deleting contact:", error);
            res.status(500).json({ success: false, message: "Server error", error });
        }
    }

    // Get contact by email
    static async getContactByEmail(req, res) {
        try {
            const { email } = req.params;
            const contact = await Contact.findOne({ email });
            if (!contact) {
                return res.status(404).json({ message: "Contact not found" });
            }
            res.status(200).json({ success: true, data: contact });
        } catch (error) {
            console.error("Error fetching contact by email:", error);
            res.status(500).json({ message: "Server error" });
        }
    }

}

module.exports = ContactController;
