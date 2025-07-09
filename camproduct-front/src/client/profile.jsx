import React, { useState, useEffect } from 'react';
import './profile.css';

const ClientProfile = () => {
    const [profile, setProfile] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        profileImage: 'https://via.placeholder.com/150'
    });

    // Simulated fetch profile data
    useEffect(() => {
        // TODO: Replace with actual API call
        const fetchProfile = async () => {
            try {
                // Fetch profile data from your API
                // const response = await fetch('/api/profile');
                // const data = await response.json();
                // setProfile(data);
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };

        fetchProfile();
    }, []);

    const handleUpdateProfile = (e) => {
        e.preventDefault();
        // TODO: Implement profile update logic
    };

    return (
        <div className="profile-container">
            <div className="profile-header">
                <img 
                    src={profile.profileImage} 
                    alt="Profile" 
                    className="profile-image"
                />
                <h2>Mon Profil</h2>
            </div>

            <form onSubmit={handleUpdateProfile} className="profile-form">
                <div className="form-group">
                    <label>Prénom:</label>
                    <input
                        type="text"
                        value={profile.firstName}
                        onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                    />
                </div>

                <div className="form-group">
                    <label>Nom:</label>
                    <input
                        type="text"
                        value={profile.lastName}
                        onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                    />
                </div>

                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({...profile, email: e.target.value})}
                    />
                </div>

                <div className="form-group">
                    <label>Téléphone:</label>
                    <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => setProfile({...profile, phone: e.target.value})}
                    />
                </div>

                <div className="form-group">
                    <label>Adresse:</label>
                    <textarea
                        value={profile.address}
                        onChange={(e) => setProfile({...profile, address: e.target.value})}
                    />
                </div>

                <button type="submit" className="update-button">
                    Mettre à jour le profil
                </button>
            </form>
        </div>
    );
};

export default ClientProfile;