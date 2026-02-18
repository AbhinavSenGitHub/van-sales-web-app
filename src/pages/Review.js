
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Stepper from '../components/Stepper';

const Review = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { basicInfo, selectedCustomers, schedule } = location.state || {};

    const handleSubmit = () => {
        // Combine all data
        const payload = {
            ...basicInfo,
            customerIds: selectedCustomers,
            schedule,
            status: basicInfo.isActive ? 'Active' : 'Inactive'
        };

        fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/journey-plans`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(res => res.json())
            .then(data => {
                alert('Journey Plan Created Successfully!');
                navigate('/'); // Redirect to home or list
            })
            .catch(err => alert('Error creating plan'));
    };

    if (!basicInfo) return <div className="container">No data to review. Start over.</div>;

    return (
        <div className="container">
            <Stepper currentStep={4} />

            <div className="card">
                <div className="section-title">Review Journey Plan</div>

                <div className="form-grid">
                    <div className="form-group">
                        <label className="form-label">Route Name</label>
                        <div>{basicInfo.routeName}</div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Route Code</label>
                        <div>{basicInfo.routeCode}</div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Status</label>
                        <span className="status-label" style={{ color: basicInfo.isActive ? 'green' : 'red' }}>
                            {basicInfo.isActive ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Company</label>
                        <div>{basicInfo.company}</div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Assigned To</label>
                        <div>{basicInfo.primaryEmployee} ({basicInfo.role})</div>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="section-title">Selected Customers ({selectedCustomers?.length || 0})</div>
                <p>Customers ID: {selectedCustomers?.join(', ')}</p>
                {/* Could fetch and show names if we had time/state for it */}
            </div>

            <div className="card">
                <div className="section-title">Schedule</div>
                <div className="form-grid">
                    <div className="form-group">
                        <label className="form-label">Frequency</label>
                        <div>{schedule?.frequency}</div>
                    </div>
                    {schedule?.days?.length > 0 && (
                        <div className="form-group">
                            <label className="form-label">Days</label>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                {schedule.days.map(d => <span key={d} style={{ background: '#F4F6F8', padding: '2px 8px', borderRadius: '4px' }}>{d}</span>)}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div style={{ textAlign: 'right', marginTop: '24px' }}>
                <button className="btn" style={{ marginRight: '12px' }} onClick={() => navigate(-1)}>Back</button>
                <button className="btn btn-primary" onClick={handleSubmit}>Submit Plan</button>
            </div>
        </div>
    );
};

export default Review;
