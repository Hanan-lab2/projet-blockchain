// client/src/pages/Home.jsx
import { Link } from 'react-router-dom';

const styles = {
    container: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        overflowY: 'auto',
        padding: '40px 20px'
    },
    content: {
        maxWidth: '1400px',
        margin: '0 auto',
        minHeight: 'calc(100vh - 80px)',
        display: 'flex',
        flexDirection: 'column'
    },
    header: {
        textAlign: 'center',
        marginBottom: '50px'
    },
    badge: {
        display: 'inline-block',
        backgroundColor: 'rgba(255,255,255,0.15)',
        backdropFilter: 'blur(10px)',
        padding: '8px 28px',
        borderRadius: '50px',
        fontSize: '14px',
        fontWeight: '600',
        color: '#fff',
        marginBottom: '20px',
        letterSpacing: '1.5px'
    },
    title: {
        fontSize: '48px',
        fontWeight: '700',
        color: '#fff',
        marginBottom: '15px',
        textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
    },
    subtitle: {
        fontSize: '18px',
        color: 'rgba(255,255,255,0.85)',
        maxWidth: '700px',
        margin: '0 auto',
        lineHeight: '1.6'
    },
    grid: {
        flex: 1,
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '25px',
        marginBottom: '40px'
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: '20px',
        padding: '30px 20px',
        textDecoration: 'none',
        color: '#1a202c',
        transition: 'all 0.3s ease',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        border: '1px solid rgba(255,255,255,0.2)',
        display: 'block',
        textAlign: 'center',
        cursor: 'pointer'
    },
    cardNumber: {
        display: 'inline-block',
        backgroundColor: '#2a5298',
        color: '#fff',
        fontSize: '14px',
        fontWeight: '600',
        padding: '6px 16px',
        borderRadius: '25px',
        marginBottom: '20px',
        letterSpacing: '0.5px'
    },
    cardTitle: {
        fontSize: '18px',
        fontWeight: '600',
        color: '#1e3c72',
        marginBottom: '10px',
        lineHeight: '1.4'
    },
    cardDesc: {
        fontSize: '13px',
        color: '#64748b',
        lineHeight: '1.5'
    },
    footer: {
        textAlign: 'center',
        paddingTop: '25px',
        borderTop: '1px solid rgba(255,255,255,0.2)',
        color: 'rgba(255,255,255,0.7)',
        fontSize: '13px'
    }
};

// Styles responsives
const responsiveStyles = `
    @media (max-width: 1200px) {
        .exercice-grid {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 20px !important;
        }
    }
    @media (max-width: 900px) {
        .exercice-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 18px !important;
        }
        .home-title {
            font-size: 36px !important;
        }
    }
    @media (max-width: 600px) {
        .exercice-grid {
            grid-template-columns: 1fr !important;
            gap: 15px !important;
        }
        .home-title {
            font-size: 28px !important;
        }
        .card-padding {
            padding: 20px 15px !important;
        }
    }
`;

function Home() {
    const exercices = [
        { num: 1, title: "Somme de deux variables", desc: "Fonctions view et pure" },
        { num: 2, title: "Conversion des cryptomonnaies", desc: "Ether ↔ Wei" },
        { num: 3, title: "Traitement des chaînes de caractères", desc: "Manipulation de strings" },
        { num: 4, title: "Tester le signe d'un nombre", desc: "Vérification de positivité" },
        { num: 5, title: "Tester la parité d'un nombre", desc: "Pair ou impair" },
        { num: 6, title: "Gestion des tableaux", desc: "Somme et gestion" },
        { num: 7, title: "Programmation orientée objet", desc: "Formes géométriques" },
        { num: 8, title: "Variables globales", desc: "msg.sender et msg.value" }
    ];

    return (
        <div style={styles.container}>
            <style>{responsiveStyles}</style>
            <div style={styles.content}>
                <div style={styles.header}>
                    <div style={styles.badge}>PROJET DE FIN DE MODULE</div>
                    <h1 className="home-title" style={styles.title}>Développement d'une dApp pour le TP 3</h1>
                    <p style={styles.subtitle}>
                        Solidity · Truffle · ReactJS · Web3.js
                    </p>
                </div>

                <div className="exercice-grid" style={styles.grid}>
                    {exercices.map(ex => (
                        <Link 
                            key={ex.num} 
                            to={`/exercice${ex.num}`} 
                            className="card-padding"
                            style={styles.card}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-8px)';
                                e.currentTarget.style.boxShadow = '0 20px 35px rgba(0,0,0,0.15)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
                            }}
                        >
                            <div style={styles.cardNumber}>Exercice {ex.num}</div>
                            <div style={styles.cardTitle}>{ex.title}</div>
                            <div style={styles.cardDesc}>{ex.desc}</div>
                        </Link>
                    ))}
                </div>

                <div style={styles.footer}>
                    Blockchain et Web3 · ILIA · Université Moulay Ismail
                </div>
            </div>
        </div>
    );
}

export default Home;