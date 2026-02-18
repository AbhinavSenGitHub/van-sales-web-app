
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Stepper from '../components/Stepper';
import '../App.css';

const CreateJourneyPlan = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        routeName: '',
        routeCode: '',
        validFrom: '',
        validTo: '',
        company: '',
        warehouse: '',
        vehicle: '',
        role: '',
        primaryEmployee: '',
        isActive: true
    });

    const [options, setOptions] = useState({
        companies: [],
        warehouses: [],
        vehicles: [],
        roles: [],
        employees: []
    });

    useEffect(() => {
        // Fetch mock options from backend
        fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/journey-plans/options`)
            .then(res => res.json())
            .then(data => setOptions(data))
            .catch(err => console.log('Error fetching options:', err));
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === 'company') {
            const selectedCompany = options.companies.find(c => c.id === value);
            setFormData(prev => ({
                ...prev,
                company: value,
                companyName: selectedCompany ? selectedCompany.name : ''
            }));
            return;
        }

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate('/customers', { state: { basicInfo: formData } });
    };

    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="container">
            <Stepper currentStep={1} />

            <form onSubmit={handleSubmit}>
                <div className="card">
                    <div className="section-title">
                        <span>Route Information</span>
                        <div className="header-row">
                            <span className="status-label">Status: {formData.isActive ? 'Active' : 'Inactive'}</span>
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={handleChange}
                                />
                                <span className="slider"></span>
                            </label>
                        </div>
                    </div>

                    <div className="form-group mb-6">
                        <label className="form-label">Route Name <span>*</span></label>
                        <input
                            type="text"
                            className="form-input"
                            name="routeName"
                            placeholder="e.g., Downtown Morning Route"
                            value={formData.routeName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Route Code <span>*</span></label>
                            <input
                                type="text"
                                className="form-input"
                                name="routeCode"
                                placeholder="Enter route code"
                                value={formData.routeCode}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Valid From <span>*</span></label>
                            <input
                                type="date"
                                className="form-input"
                                name="validFrom"
                                value={formData.validFrom}
                                onChange={handleChange}
                                min={today}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Valid To <span>*</span></label>
                            <input
                                type="date"
                                className="form-input"
                                name="validTo"
                                value={formData.validTo}
                                onChange={handleChange}
                                min={formData.validFrom || today}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Company <span>*</span></label>
                            <select
                                className="form-select"
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Company</option>
                                {options.companies && options.companies.map((c, i) => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Warehouse (WH)</label>
                            <select
                                className={`form-select ${!formData.company ? 'disabled' : ''}`}
                                name="warehouse"
                                value={formData.warehouse}
                                onChange={handleChange}
                                disabled={!formData.company}
                            >
                                <option value="">Select Company first</option>
                                {formData.company && options.warehouses.map((w, i) => (
                                    <option key={i} value={w}>{w}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Vehicle</label>
                            <select
                                className={`form-select ${!formData.company ? 'disabled' : ''}`}
                                name="vehicle"
                                value={formData.vehicle}
                                onChange={handleChange}
                                disabled={!formData.company}
                            >
                                <option value="">Select Company first</option>
                                {formData.company && options.vehicles.map((v, i) => (
                                    <option key={i} value={v}>{v}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="section-title">Assignment</div>
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Role <span>*</span></label>
                            <select
                                className="form-select"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select role</option>
                                {options.roles.map((r, i) => (
                                    <option key={i} value={r}>{r}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Primary Employee <small>(automatically assigned to route)</small></label>
                            <select
                                className="form-select"
                                name="primaryEmployee"
                                value={formData.primaryEmployee}
                                onChange={handleChange}
                            >
                                <option value="">Select primary employee</option>
                                {options.employees.map((e, i) => (
                                    <option key={i} value={e}>{e}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="text-right">
                    <button type="submit" className="btn btn-primary">Next Step</button>
                </div>
            </form>
        </div>
    );
};

export default CreateJourneyPlan;
