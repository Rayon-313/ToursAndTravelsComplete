import express from 'express';
import Contact from '../models/Contact.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    let contact = await Contact.findOne();
    if (!contact) {
      contact = new Contact({
        phone: '+61478160445',
        heroHeading: 'How can I help you?',
        helpTopics: [
          { icon: 'calendar', title: 'Booking & Cancellations', text: 'Modify your itinerary, cancel trips, or check your reservation status.' },
          { icon: 'card', title: 'Payment & Invoices', text: 'Manage billings, download receipts, and view payment history.' },
          { icon: 'globe', title: 'Destinations and Visas', text: 'Find destination guides and entry requirements for your next trip.' },
          { icon: 'star', title: 'Loyalty Program', text: 'Earn and redeem points.' },
          { icon: 'user', title: 'Account Settings', text: 'Update profile details, security settings, and notifications.' },
          { icon: 'shield', title: 'Safety & Travel Advice', text: 'Stay informed with latest travel advisories and safety protocols.' },
        ],
        faqs: [
          { question: 'How do I cancel my booking?', answer: 'You can cancel your booking through the My Bookings section in your account. Select the trip you wish to cancel and follow the prompts. Refund eligibility depends on the specific booking terms.' },
          { question: 'What is the refund policy?', answer: 'Refunds depend on the package, supplier rules, and cancellation date. Our support team can review your booking and confirm the exact refundable amount.' },
          { question: 'How do I earn points?', answer: 'You earn loyalty points when you complete eligible bookings through Aariyana Tours and Travels.' },
          { question: 'Can I change my travel dates after booking?', answer: 'Many bookings can be changed before departure, depending on availability and supplier policies. Some changes may include fare or service differences.' },
        ],
      });
      await contact.save();
    }
    res.json(contact);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/', authenticateToken, async (req, res) => {
  try {
    let contact = await Contact.findOne();
    if (!contact) { contact = new Contact(); }
    Object.assign(contact, req.body);
    await contact.save();
    res.json(contact);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
