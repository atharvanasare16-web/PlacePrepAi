import { useState, useEffect } from 'react';
import { ROLE_PROFILES } from './data/roles';
import RoleSelector from './components/RoleSelector';
import Sidebar from './components/Sidebar';
import RoleHub from './components/RoleHub';
import MockInterview from './components/MockInterview';
import PracticeQuestions from './components/PracticeQuestions';
import CodeChallenges from './components/CodeChallenges';
import ConceptExplainer from './components/ConceptExplainer';
import ResumeReview from './components/ResumeReview';
import StudyRoadmap from './components/StudyRoadmap';
import { COLORS } from './data/colors';

export default function App() {
  const [selectedRoleId, setSelectedRoleId] = useState(() => {
    try {
      const saved = localStorage.getItem('placement_prep_role');
      if (saved && ROLE_PROFILES[saved]) return saved;
    } catch (e) {
      // localStorage unavailable
    }
    return null;
  });
  const [active, setActive] = useState('dashboard');

  // Persist selected role to localStorage
  useEffect(() => {
    if (selectedRoleId) {
      try {
        localStorage.setItem('placement_prep_role', selectedRoleId);
      } catch (e) {
        // localStorage unavailable
      }
    }
  }, [selectedRoleId]);

  const handleSelectRole = (id) => {
    setSelectedRoleId(id);
    setActive('dashboard');
  };

  const handleSwitchRole = () => {
    setSelectedRoleId(null);
    setActive('dashboard');
    try {
      localStorage.removeItem('placement_prep_role');
    } catch (e) {
      // localStorage unavailable
    }
  };

  // Show role selector if no role chosen
  if (!selectedRoleId) {
    return <RoleSelector onSelect={handleSelectRole} />;
  }

  const role = ROLE_PROFILES[selectedRoleId];

  // Fallback if stored role ID is somehow invalid
  if (!role) {
    return <RoleSelector onSelect={handleSelectRole} />;
  }

  const views = {
    dashboard: <RoleHub role={role} setActive={setActive} />,
    interview: <MockInterview role={role} />,
    practice: <PracticeQuestions role={role} />,
    codesnippet: <CodeChallenges role={role} />,
    concepts: <ConceptExplainer role={role} />,
    resume: <ResumeReview role={role} />,
    roadmap: <StudyRoadmap role={role} />,
  };

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        background: COLORS.bg,
        fontFamily: "'Inter', -apple-system, sans-serif",
        color: COLORS.textPrimary,
        overflow: 'hidden',
      }}
    >
      <Sidebar
        active={active}
        setActive={setActive}
        role={role}
        onSwitchRole={handleSwitchRole}
      />
      <main
        style={{
          flex: 1,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {views[active] || views.dashboard}
      </main>
    </div>
  );
}
