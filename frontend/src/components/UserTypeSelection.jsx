import './AuthForm.css';

const UserTypeSelection = ({ onSelect }) => {

const handleSelect = (type) => {
// 🔥 Save user type globally
localStorage.setItem("userType", type);


// pass to parent
if (onSelect) {
  onSelect(type);
}


};

return ( <div className="selection-layout">

  <div className="section-title">
    <h2>Select user type</h2>
    <p>Choose the role that best describes your access level.</p>
  </div>

  <div className="user-type-grid">

    <button className="type-card" onClick={() => handleSelect('Citizen')}>
      <div>
        <h3>Citizen</h3>
        <p>Access public insights and submit local climate feedback.</p>
      </div>
    </button>

    <button className="type-card" onClick={() => handleSelect('Government')}>
      <div>
        <h3>Government</h3>
        <p>View advanced decision support tools and regional analytics.</p>
      </div>
    </button>

    <button className="type-card" onClick={() => handleSelect('NGO')}>
      <div>
        <h3>NGO</h3>
        <p>Coordinate local support and community alerts.</p>
      </div>
    </button>

  </div>

</div>


);
};

export default UserTypeSelection;
