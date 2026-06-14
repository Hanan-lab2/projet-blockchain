// client/src/pages/Exercice1.jsx
import { useState, useEffect } from 'react';
import Web3 from 'web3';
import Exercice1Contract from '../contracts/Exercice1.json';
import BlockchainInfo from '../components/BlockchainInfo';
import { Link } from 'react-router-dom';

const GANACHE_URL = "http://127.0.0.1:7545";

const styles = {
    container: {
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#f8fafc',
        padding: 0,
        margin: 0,
        boxSizing: 'border-box'
    },
    content: {
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '24px'
    },
   title: {
    color: '#1a2c3e',
    marginBottom: '28px',
    fontSize: '28px',
    fontWeight: '700',
    letterSpacing: '-0.3px',
    textAlign: 'center'
},
    row: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '24px',
        marginBottom: '24px'
    },
    col: {
        flex: 1,
        minWidth: '280px'
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        padding: '24px',
        border: '1px solid #e9eef3',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        height: '100%'
    },
    cardTitle: {
        color: '#2a5298',
        marginBottom: '16px',
        fontSize: '18px',
        fontWeight: '600',
        borderLeft: '3px solid #2a5298',
        paddingLeft: '12px'
    },
    infoText: {
        backgroundColor: '#f1f5f9',
        padding: '12px 16px',
        borderRadius: '12px',
        fontSize: '13px',
        color: '#334155',
        marginBottom: '20px',
        fontFamily: 'monospace'
    },
    inputGroup: {
        marginBottom: '16px'
    },
    label: {
        display: 'block',
        fontSize: '13px',
        fontWeight: '500',
        color: '#475569',
        marginBottom: '6px'
    },
    input: {
        width: '100%',
        maxWidth: '280px',
        padding: '10px 14px',
        fontSize: '14px',
        border: '1px solid #cbd5e1',
        borderRadius: '12px',
        outline: 'none',
        transition: 'all 0.2s',
        boxSizing: 'border-box'
    },
    button: {
        backgroundColor: '#2a5298',
        color: '#ffffff',
        border: 'none',
        padding: '10px 24px',
        borderRadius: '30px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.2s',
        marginTop: '8px'
    },
    resultBox: {
        backgroundColor: '#f0fdf4',
        borderRadius: '16px',
        padding: '20px',
        marginTop: '8px',
        border: '1px solid #bbf7d0'
    },
    resultTitle: {
        color: '#166534',
        marginBottom: '10px',
        fontWeight: '600',
        fontSize: '14px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
    },
    resultText: {
        fontFamily: 'monospace',
        fontSize: '14px',
        color: '#14532d',
        lineHeight: '1.5'
    },
    backLink: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        marginTop: '20px',
        marginBottom: '24px',
        textDecoration: 'none',
        color: '#2a5298',
        fontWeight: '500',
        fontSize: '14px',
        transition: 'all 0.2s'
    }
};

function Exercice1() {
    const [contract, setContract] = useState(null);
    const [web3, setWeb3] = useState(null);
    const [account, setAccount] = useState('');
    const [result, setResult] = useState('');
    const [nombre1, setNombre1] = useState('');
    const [nombre2, setNombre2] = useState('');

    useEffect(() => {
        init();
    }, []);

    async function init() {
        try {
            const web3Instance = new Web3(GANACHE_URL);
            setWeb3(web3Instance);
            
            const accounts = await web3Instance.eth.getAccounts();
            setAccount(accounts[0]);
            
            const networkId = await web3Instance.eth.net.getId();
            const deployedNetwork = Exercice1Contract.networks[networkId];
            
            if (deployedNetwork) {
                const contractInstance = new web3Instance.eth.Contract(
                    Exercice1Contract.abi,
                    deployedNetwork.address
                );
                setContract(contractInstance);
                const val1 = await contractInstance.methods.nombre1().call();
                const val2 = await contractInstance.methods.nombre2().call();
                setResult(`Valeurs par défaut: nombre1 = ${val1}, nombre2 = ${val2}`);
            } else {
                setResult(" Contrat non trouvé. Vérifie le déploiement.");
            }
        } catch (error) {
            console.error("Erreur init:", error);
            setResult(" Erreur de connexion à Ganache");
        }
    }

    async function addition1() {
        if (!contract) {
            setResult(" Contrat non initialisé");
            return;
        }
        try {
            const resultat = await contract.methods.addition1().call();
            setResult(` addition1() = ${resultat}`);
        } catch (error) {
            setResult(" Erreur: " + error.message);
        }
    }

    async function addition2() {
        if (!contract) {
            setResult(" Contrat non initialisé");
            return;
        }
        if (nombre1 === '' || nombre2 === '') {
            setResult(" Veuillez saisir deux nombres");
            return;
        }
        try {
            const a = parseInt(nombre1);
            const b = parseInt(nombre2);
            const resultat = await contract.methods.addition2(a, b).call();
            setResult(` ${a} + ${b} = ${resultat}`);
        } catch (error) {
            console.error("Erreur addition2:", error);
            setResult(" Erreur: " + error.message);
        }
    }

    return (
        <div style={styles.container}>
            <div style={styles.content}>
                <h1 style={styles.title}> Exercice 1 : Addition de deux nombres</h1>
                
                <BlockchainInfo 
                    web3={web3} 
                    contractAddress={contract?.options?.address}
                    account={account}
                />
                
                <div style={styles.row}>
                    {/*  addition1 */}
                    <div style={styles.col}>
                        <div style={styles.card}>
                            <div style={styles.cardTitle}> addition1</div>
                            <div style={styles.infoText}>
                                <strong>Variables d'état :</strong><br/>
                                nombre1 = 10 &nbsp;|&nbsp; nombre2 = 20
                            </div>
                            <button style={styles.button} onClick={addition1}>
                                Calculer addition1
                            </button>
                        </div>
                    </div>
                    
                    {/*  addition2 */}
                    <div style={styles.col}>
                        <div style={styles.card}>
                            <div style={styles.cardTitle}> addition2(a, b)</div>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Nombre 1</label>
                                <input 
                                    type="number" 
                                    placeholder="Ex: 15" 
                                    style={styles.input}
                                    onChange={(e) => setNombre1(e.target.value)}
                                />
                            </div>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Nombre 2</label>
                                <input 
                                    type="number" 
                                    placeholder="Ex: 27" 
                                    style={styles.input}
                                    onChange={(e) => setNombre2(e.target.value)}
                                />
                            </div>
                            <button style={styles.button} onClick={addition2}>
                                Calculer addition2
                            </button>
                        </div>
                    </div>
                </div>
                
                <div style={styles.resultBox}>
                    <div style={styles.resultTitle}> Résultat</div>
                    <div style={styles.resultText}>{result || "Cliquez sur un bouton pour voir le résultat"}</div>
                </div>
                
               
            </div>
        </div>
    );
}

export default Exercice1;