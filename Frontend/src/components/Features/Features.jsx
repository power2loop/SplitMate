import React from 'react';
import { 
  Calculator, 
  Users, 
  Smartphone, 
  CreditCard, 
  Bell, 
  Shield 
} from 'lucide-react';
import './Features.css';

const Features = () => {
  const features = [
    {
      icon: Calculator,
      title: "Smart Splitting",
      description: "Automatically calculate who owes what with intelligent expense splitting algorithms."
    },
    {
      icon: Users,
      title: "Group Management",
      description: "Create and manage multiple groups for different occasions - trips, roommates, or regular hangouts."
    },
    {
      icon: Smartphone,
      title: "Mobile First",
      description: "Track expenses on the go with our beautifully designed mobile app that works offline."
    },
    {
      icon: CreditCard,
      title: "Multiple Payment Methods",
      description: "Support for various payment methods including Venmo, PayPal, bank transfers, and cash."
    },
    {
      icon: Bell,
      title: "Smart Reminders",
      description: "Gentle reminders for pending payments and expense settlements without being pushy."
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Bank-level security with end-to-end encryption to keep your financial data safe."
    }
  ];

  return (
    <section id="features" className="features section">
      <div className="container">
        <div className="features-header">
          <h2 className="heading-2 text-center animate-fade-in">
            Everything you need to split expenses
          </h2>
          <p className="text-large text-muted text-center animate-fade-in">
            Powerful features designed to make splitting bills and tracking expenses effortless
          </p>
        </div>
        
        <div className="features-grid">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index} 
                className={`feature-item animate-scale-in`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="feature-icon">
                  <Icon className="icon icon-large" />
                </div>
                <div className="feature-content">
                  <h3 className="heading-3">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;