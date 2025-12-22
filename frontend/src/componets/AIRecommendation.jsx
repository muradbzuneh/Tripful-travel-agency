import { useState } from 'react';
import '../styles/ai-recommendation.css';

export default function AIRecommendation() {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const predefinedResponses = {
    'booking': 'To book a package: 1) Browse our packages, 2) Click "View Details" or "Book Now", 3) Select your travel date, 4) Complete the booking. You can pay later using our "Book Now, Pay Later" feature!',
    'payment': 'You can make payments anytime after booking! Go to "My Bookings", find your booking, and click "Make Payment". You can pay partially or in full - whatever works for you.',
    'packages': 'We offer amazing holiday packages including Dubai Desert Adventures, Tropical Paradise in Maldives, and European City Breaks. Each package includes flights and hotels. Browse our packages page to see all options!',
    'staff': 'Staff members can manage packages and bookings through the Staff Dashboard. Only administrators can create staff accounts for security reasons.',
    'cancel': 'To modify or cancel bookings, please contact our staff through the booking management system. Staff can update booking statuses as needed.',
    'help': 'I can help you with: booking packages, making payments, understanding our services, staff functions, and general website navigation. What would you like to know?',
    'features': 'Tripful features: Browse holiday packages, Book Now Pay Later, secure booking system, staff management dashboard, payment tracking, and detailed package information with images and ratings.',
    'default': 'I\'m here to help with Tripful! I can assist with bookings, payments, packages, and website features. Try asking about "how to book", "payment options", or "available packages".'
  };

  const getAIResponse = (userQuestion) => {
    const lowerQuestion = userQuestion.toLowerCase();
    
    if (lowerQuestion.includes('book') || lowerQuestion.includes('reservation')) {
      return predefinedResponses.booking;
    } else if (lowerQuestion.includes('pay') || lowerQuestion.includes('payment') || lowerQuestion.includes('money')) {
      return predefinedResponses.payment;
    } else if (lowerQuestion.includes('package') || lowerQuestion.includes('trip') || lowerQuestion.includes('destination')) {
      return predefinedResponses.packages;
    } else if (lowerQuestion.includes('staff') || lowerQuestion.includes('admin') || lowerQuestion.includes('manage')) {
      return predefinedResponses.staff;
    } else if (lowerQuestion.includes('cancel') || lowerQuestion.includes('modify') || lowerQuestion.includes('change')) {
      return predefinedResponses.cancel;
    } else if (lowerQuestion.includes('help') || lowerQuestion.includes('what') || lowerQuestion.includes('how')) {
      return predefinedResponses.help;
    } else if (lowerQuestion.includes('feature') || lowerQuestion.includes('service') || lowerQuestion.includes('offer')) {
      return predefinedResponses.features;
    } else {
      return predefinedResponses.default;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    
    // Simulate AI processing delay
    setTimeout(() => {
      const aiResponse = getAIResponse(question);
      setResponse(aiResponse);
      setLoading(false);
    }, 1000);
  };

  const handleQuickQuestion = (quickQ) => {
    setQuestion(quickQ);
    const aiResponse = getAIResponse(quickQ);
    setResponse(aiResponse);
  };

  return (
    <div className="ai-recommendation">
      <button 
        className="ai-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        🤖 AI Assistant
      </button>

      {isOpen && (
        <div className="ai-chat-box">
          <div className="ai-header">
            <h4>Tripful AI Assistant</h4>
            <button onClick={() => setIsOpen(false)} className="close-btn">×</button>
          </div>

          <div className="ai-content">
            <div className="quick-questions">
              <p>Quick questions:</p>
              <button onClick={() => handleQuickQuestion('How to book a package?')}>
                How to book?
              </button>
              <button onClick={() => handleQuickQuestion('Payment options?')}>
                Payment options?
              </button>
              <button onClick={() => handleQuickQuestion('Available packages?')}>
                Available packages?
              </button>
            </div>

            {response && (
              <div className="ai-response">
                <strong>AI Assistant:</strong>
                <p>{response}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="ai-form">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask me anything about Tripful..."
                disabled={loading}
              />
              <button type="submit" disabled={loading || !question.trim()}>
                {loading ? '🤔' : '📤'}
              </button>
            </form>

            <div className="ai-disclaimer">
              <small>AI responses are based on Tripful website functionality</small>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}