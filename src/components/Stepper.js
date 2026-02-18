
import React from 'react';
import '../App.css';

const Stepper = ({ currentStep }) => {
    const steps = [
        { id: 1, label: 'Basic Information' },
        { id: 2, label: 'Customers' },
        { id: 3, label: 'Schedule' },
        { id: 4, label: 'Review' }
    ];

    return (
        <div className="stepper">
            {steps.map((step) => {
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;

                return (
                    <div key={step.id} className={`step-item ${isActive ? 'active' : ''}`}>
                        <div className={`step-circle ${isCompleted ? 'completed' : ''}`}>
                            {isCompleted ? '✓' : step.id}
                        </div>
                        <span className="step-label">{step.label}</span>
                    </div>
                );
            })}
        </div>
    );
};

export default Stepper;
