import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema({
  question: String,
  answer: String,
});

const helpTopicSchema = new mongoose.Schema({
  icon: String,
  title: String,
  text: String,
});

const contactSchema = new mongoose.Schema({
  phone: { type: String, default: '+61478160445' },
  email: { type: String, default: '' },
  address: { type: String, default: '' },
  contactInfo: { type: String, default: '' },
  supportContent: { type: String, default: '' },
  faqs: [faqSchema],
  helpTopics: [helpTopicSchema],
  formLabels: {
    name: { type: String, default: 'Name' },
    email: { type: String, default: 'Email' },
    message: { type: String, default: 'Message' },
  },
  heroHeading: { type: String, default: 'How can I help you?' },
}, { timestamps: true });

export default mongoose.model('Contact', contactSchema);
