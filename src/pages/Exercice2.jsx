// client/src/pages/Exercice2.jsx
import { useState, useEffect } from 'react';
import Web3 from 'web3';
import Exercice2Contract from '../contracts/Exercice2.json';
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
    card: {
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        padding: '24px',
        border: '1px solid #e9eef3',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        marginBottom: '0'
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
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '10px'
    },
    input: {
        padding: '10px 14px',
        borderRadius: '12px',
        border: '1px solid #cbd5e1',
        width: '240px',
        fontSize: '14px',
        outline: 'none',
        transition: 'all 0.2s'
    },
    radioGroup: {
        display: 'flex',
        gap: '24px',
        marginBottom: '20px',
        padding: '12px 0'
    },
    radioLabel: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '14px',
        color: '#475569',
        cursor: 'pointer'
    },
    radio: {
        width: '16px',
        height: '16px',
        cursor: 'pointer',
        accentColor: '#2a5298'
    },
    button: {
        backgroundColor: '#2a5298',
        color: 'white',
        border: 'none',
        padding: '10px 24px',
        borderRadius: '30px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
        transition: 'all 0.2s'
    },
    resultBox: {
        backgroundColor: '#f0fdf4',
        borderRadius: '16px',
        padding: '20px',
        marginTop: '20px',
        border: '1px solid #86efac',
        boxShadow: '0 2px 8px rgba(0,128,0,0.05)'
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
        fontSize: '15px',
        color: '#064e3b',
        lineHeight: '1.5',
        fontWeight: '500'
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

function Exercice2() {
    const [contract, setContract] = useState(null);
    const [web3, setWeb3] = useState(null);
    const [account, setAccount] = useState('');
    const [result, setResult] = useState('');
    const [montant, setMontant] = useState('');
    const [mode, setMode] = useState('etherToWei');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        init();
    }, []);

    async function init() {
        setLoading(true);
        try {
            const web3Instance = new Web3(GANACHE_URL);
            setWeb3(web3Instance);
            
            const accounts = await web3Instance.eth.getAccounts();
            setAccount(accounts[0]);
            
            const networkId = await web3Instance.eth.net.getId();
            const deployedNetwork = Exercice2Contract.networks[networkId];
            
            if (deployedNetwork) {
                const contractInstance = new web3Instance.eth.Contract(
                    Exercice2Contract.abi,
                    deployedNetwork.address
                );
                setContract(contractInstance);
                setResult(" Contrat chargé.");
            } else {
                setResult(" Contrat non trouvé.");
            }
        } catch (error) {
            console.error("Erreur init:", error);
            setResult(" Erreur de connexion à Ganache");
        }
        setLoading(false);
    }

    async function convertir() {
        if (!contract) {
            setResult(" Contrat non initialisé");
            return;
        }
        if (montant === '') {
            setResult(" Veuillez saisir un montant");
            return;
        }
        setLoading(true);
        try {
            const valeur = parseFloat(montant);
            if (isNaN(valeur) || valeur < 0) {
                setResult(" Veuillez saisir un nombre valide");
                setLoading(false);
                return;
            }
            
            let resultat;
            if (mode === 'etherToWei') {
                resultat = await contract.methods.etherEnWei(valeur).call();
                setResult(` ${valeur} ETH = ${resultat} Wei`);
            } else {
                resultat = await contract.methods.weiEnEther(valeur).call();
                setResult(` ${valeur} Wei = ${resultat} ETH`);
            }
        } catch (error) {
            setResult(" Erreur: " + error.message);
        }
        setLoading(false);
    }

    return (
        <div style={styles.container}>
            <div style={styles.content}>
                <h1 style={styles.title}> Exercice 2 : Conversion Ether / Wei</h1>
                
                <BlockchainInfo 
                    web3={web3} 
                    contractAddress={contract?.options?.address}
                    account={account}
                />
                
                <div style={styles.card}>
                    <div style={styles.cardTitle}> Conversion</div>
                    <div style={styles.infoText}>
                        <strong>1 Ether = 1,000,000,000,000,000,000 Wei</strong><br/>
                        (10¹⁸ Wei)
                    </div>
                    
                    <div style={styles.radioGroup}>
                        <label style={styles.radioLabel}>
                            <input 
                                type="radio" 
                                value="etherToWei" 
                                checked={mode === 'etherToWei'} 
                                onChange={() => setMode('etherToWei')}
                                style={styles.radio}
                            />
                            Ether → Wei
                        </label>
                        <label style={styles.radioLabel}>
                            <input 
                                type="radio" 
                                value="weiToEther" 
                                checked={mode === 'weiToEther'} 
                                onChange={() => setMode('weiToEther')}
                                style={styles.radio}
                            />
                            Wei → Ether
                        </label>
                    </div>
                    
                    <div style={styles.inputGroup}>
                        <input 
                            type="number" 
                            step="any"
                            placeholder={mode === 'etherToWei' ? "Montant en Ether" : "Montant en Wei"}
                            value={montant}
                            onChange={(e) => setMontant(e.target.value)}
                            style={styles.input}
                            disabled={loading}
                        />
                        <button style={styles.button} onClick={convertir} disabled={loading}>
                            {loading ? "Conversion..." : "Convertir"}
                        </button>
                    </div>
                </div>
                
                <div style={styles.resultBox}>
                    <div style={styles.resultTitle}> Résultat</div>
                    <div style={styles.resultText}>{result || "Sélectionnez un mode, entrez un montant, puis cliquez sur Convertir"}</div>
                </div>
            
            </div>
        </div>
    );
}

export default Exercice2;