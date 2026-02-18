
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Stepper from '../components/Stepper';

const Schedule = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Use existing schedule from state if navigating back, or default
    const [schedule, setSchedule] = useState(location.state?.schedule || {
        frequency: 'Weekly',
        days: []
    });

    const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const handleDayToggle = (day) => {
        setSchedule(prev => ({
            ...prev,
            days: prev.days.includes(day)
                ? prev.days.filter(d => d !== day)
                : [...prev.days, day]
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSchedule(prev => ({ ...prev, [name]: value }));
    };

    const handleNext = () => {
        navigate('/review', { state: { ...location.state, schedule } });
    };

    return (
        <div className="container">
            <Stepper currentStep={3} />
            <div className="card">
                <div className="section-title">Schedule</div>

                <div className="form-grid">
                    <div className="form-group">
                        <label className="form-label">Frequency</label>
                        <select
                            className="form-select"
                            name="frequency"
                            value={schedule.frequency}
                            onChange={handleChange}
                        >
                            <option>Daily</option>
                            <option>Weekly</option>
                            <option>Monthly</option>
                        </select>
                    </div>
                </div>

                {schedule.frequency === 'Weekly' && (
                    <div style={{ marginTop: '24px' }}>
                        <label className="form-label">Select Days</label>
                        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                            {weekDays.map(day => (
                                <button
                                    key={day}
                                    type="button"
                                    onClick={() => handleDayToggle(day)}
                                    style={{
                                        padding: '8px 16px',
                                        borderRadius: '20px',
                                        border: `1px solid ${schedule.days.includes(day) ? '#00AB55' : '#E0E0E0'}`,
                                        background: schedule.days.includes(day) ? '#00AB55' : '#fff',
                                        color: schedule.days.includes(day) ? '#fff' : '#637381',
                                        cursor: 'pointer',
                                        fontWeight: 600
                                    }}
                                >
                                    {day.slice(0, 3)}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <div style={{ textAlign: 'right', marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button className="btn" onClick={() => navigate(-1)}>
                    Previous
                </button>
                <button className="btn btn-primary" onClick={handleNext}>Next Step</button>
            </div>
        </div>
    );
};

export default Schedule;
