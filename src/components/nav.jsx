// client/src/components/nav.jsx
import { Link, useLocation } from 'react-router-dom';

const navStyles = {
    nav: {
        position: 'sticky',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        zIndex: 100,
        backgroundColor: '#1a202c',
        padding: '12px 24px',
        margin: 0,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        boxSizing: 'border-box'
    },
    logo: {
        color: '#fff',
        fontSize: '18px',
        fontWeight: '600',
        textDecoration: 'none',
        letterSpacing: '-0.3px',
        whiteSpace: 'nowrap'
    },
    navLinks: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px'
    },
    linkHome: {
        backgroundColor: '#2a5298',
        color: '#fff',
        textDecoration: 'none',
        padding: '8px 18px',
        borderRadius: '30px',
        fontSize: '14px',
        fontWeight: '500',
        transition: 'all 0.2s',
        whiteSpace: 'nowrap'
    },
    linkExercice: {
        color: '#e2e8f0',
        textDecoration: 'none',
        padding: '8px 14px',
        borderRadius: '30px',
        fontSize: '13px',
        fontWeight: '500',
        transition: 'all 0.2s',
        backgroundColor: 'transparent',
        whiteSpace: 'nowrap'
    },
    linkExerciceActive: {
        backgroundColor: '#2a5298',
        color: '#fff'
    }
};

function Nav() {
    const location = useLocation();
    
    if (location.pathname === '/') {
        return null;
    }
    
    const exercices = [1, 2, 3, 4, 5, 6, 7, 8];
    
    return (
        <nav style={navStyles.nav}>
            <Link to="/" style={navStyles.logo}>
                dApp Blockchain
            </Link>
            <div style={navStyles.navLinks}>
                <Link to="/" style={navStyles.linkHome}>
                     ← Retour au sommaire
                </Link>
                {exercices.map(num => (
                    <Link 
                        key={num}
                        to={`/exercice${num}`}
                        style={{
                            ...navStyles.linkExercice,
                            ...(location.pathname === `/exercice${num}` ? navStyles.linkExerciceActive : {})
                        }}
                    >
                        Ex{num}
                    </Link>
                ))}
            </div>
        </nav>
    );
}

export default Nav;