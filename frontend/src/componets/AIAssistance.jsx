import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { getTranslation } from '../utils/translations';
import '../styles/ai-assistance.css';

export default function AIAssistance() {
  const { language } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const toggleAssistance = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="ai-assistance">
      <button 
        className="ai-assistance-btn"
        onClick={toggleAssistance}
        title={getTranslation('aiAssistance', language)}
      >
        <span className="ai-icon">🤖</span>
        <span className="ai-text">AI Help</span>
      </button>

      {isOpen && (
        <div className="ai-assistance-panel">
          <div className="ai-panel-header">
            <h3>🤖 AI Travel Assistant</h3>
            <button 
              className="close-btn"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
          </div>
          
          <div className="ai-panel-content">
            <div className="ai-suggestions">
              <h4>How can I help you today?</h4>
              <div className="suggestion-buttons">
                <button className="suggestion-btn">
                  🏖️ Find beach destinations
                </button>
                <button className="suggestion-btn">
                  🏔️ Mountain adventures
                </button>
                <button className="suggestion-btn">
                  🎫 Best travel deals
                </button>
                <button className="suggestion-btn">
                  📅 Plan my itinerary
                </button>
              </div>
            </div>
            
            <div className="ai-chat-input">
              <input 
                type="text" 
                placeholder="Ask me anything about travel..."
                className="chat-input"
              />
              <button className="send-btn">
                📤
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overlay */}
      {isOpen && (
        <div 
          className="ai-assistance-overlay" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}