// client/src/pages/Exercice3.jsx
import { useState, useEffect } from 'react';
import Web3 from 'web3';
import GestionChainesContract from '../contracts/GestionChaines.json';
import BlockchainInfo from '../components/BlockchainInfo';
import TransactionInfo from '../components/TransactionInfo';
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
        minWidth: '300px'
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
    label: {
        display: 'block',
        fontSize: '13px',
        fontWeight: '500',
        color: '#475569',
        marginBottom: '6px'
    },
    input: {
        width: '100%',
        padding: '10px 14px',
        fontSize: '14px',
        border: '1px solid #cbd5e1',
        borderRadius: '12px',
        outline: 'none',
        transition: 'all 0.2s',
        boxSizing: 'border-box',
        marginBottom: '16px'
    },
    buttonGroup: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
        marginTop: '8px'
    },
    button: {
        backgroundColor: '#2a5298',
        color: '#ffffff',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '30px',
        fontSize: '13px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.2s'
    },
    resultBox: {
        backgroundColor: '#f0fdf4',
        borderRadius: '16px',
        padding: '20px',
        marginTop: '8px',
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
        fontSize: '14px',
        color: '#064e3b',
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

function Exercice3() {
    const [contract, setContract] = useState(null);
    const [web3, setWeb3] = useState(null);
    const [account, setAccount] = useState('');
    const [result, setResult] = useState('');
    const [message, setMessage] = useState('');
    const [chaine1, setChaine1] = useState('');
    const [chaine2, setChaine2] = useState('');
    const [transactionHash, setTransactionHash] = useState('');
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
            const deployedNetwork = GestionChainesContract.networks[networkId];
            
            if (deployedNetwork) {
                const contractInstance = new web3Instance.eth.Contract(
                    GestionChainesContract.abi,
                    deployedNetwork.address
                );
                setContract(contractInstance);
                setResult(" Contrat chargé. Prêt à utiliser.");
            } else {
                setResult(" Contrat non trouvé. Vérifie le déploiement.");
            }
        } catch (error) {
            console.error("Erreur init:", error);
            setResult(" Erreur de connexion à Ganache");
        }
        setLoading(false);
    }

    async function setMessageHandler() {
        if (!contract) {
            setResult(" Contrat non initialisé");
            return;
        }
        if (message.trim() === '') {
            setResult(" Veuillez saisir un message");
            return;
        }
        setLoading(true);
        try {
            const tx = await contract.methods.setMessage(message).send({ from: account });
            setTransactionHash(tx.transactionHash);
            setResult(` Message modifié: "${message}"`);
        } catch (error) {
            setResult(" Erreur: " + error.message);
        }
        setLoading(false);
    }

    async function getMessageHandler() {
        if (!contract) {
            setResult(" Contrat non initialisé");
            return;
        }
        setLoading(true);
        try {
            const msg = await contract.methods.getMessage().call();
            setResult(` Message actuel: "${msg}"`);
            setTransactionHash('');
        } catch (error) {
            setResult(" Erreur: " + error.message);
        }
        setLoading(false);
    }

    async function concatenerHandler() {
        if (!contract) {
            setResult(" Contrat non initialisé");
            return;
        }
        setLoading(true);
        try {
            const resultat = await contract.methods.concatener(chaine1, chaine2).call();
            setResult(` Concaténation: "${chaine1}" + "${chaine2}" = "${resultat}"`);
            setTransactionHash('');
        } catch (error) {
            setResult(" Erreur: " + error.message);
        }
        setLoading(false);
    }

    async function concatenerAvecHandler() {
        if (!contract) {
            setResult(" Contrat non initialisé");
            return;
        }
        setLoading(true);
        try {
            const resultat = await contract.methods.concatenerAvec(chaine1).call();
            setResult(` Message + "${chaine1}" = "${resultat}"`);
            setTransactionHash('');
        } catch (error) {
            setResult(" Erreur: " + error.message);
        }
        setLoading(false);
    }

    async function longueurHandler() {
        if (!contract) {
            setResult(" Contrat non initialisé");
            return;
        }
        setLoading(true);
        try {
            const len = await contract.methods.longueur(chaine1).call();
            setResult(` Longueur de "${chaine1}" = ${len} caractères`);
            setTransactionHash('');
        } catch (error) {
            setResult(" Erreur: " + error.message);
        }
        setLoading(false);
    }

    async function comparerHandler() {
        if (!contract) {
            setResult(" Contrat non initialisé");
            return;
        }
        setLoading(true);
        try {
            const isEqual = await contract.methods.comparer(chaine1, chaine2).call();
            setResult(` "${chaine1}" et "${chaine2}" sont ${isEqual ? 'IDENTIQUES ' : 'DIFFÉRENTES '}`);
            setTransactionHash('');
        } catch (error) {
            setResult(" Erreur: " + error.message);
        }
        setLoading(false);
    }

    return (
        <div style={styles.container}>
            <div style={styles.content}>
                <h1 style={styles.title}> Exercice 3 : Gestion des chaînes de caractères</h1>
                
                <BlockchainInfo 
                    web3={web3} 
                    contractAddress={contract?.options?.address}
                    account={account}
                />
                
                <div style={styles.row}>
                    {/*  Message stocké */}
                    <div style={styles.col}>
                        <div style={styles.card}>
                            <div style={styles.cardTitle}> Message stocké</div>
                            <label style={styles.label}>Nouveau message</label>
                            <input 
                                type="text" 
                                placeholder="Ex: Bonjour blockchain" 
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                style={styles.input}
                                disabled={loading}
                            />
                            <div style={styles.buttonGroup}>
                                <button onClick={setMessageHandler} style={styles.button} disabled={loading}>
                                    setMessage
                                </button>
                                <button onClick={getMessageHandler} style={styles.button} disabled={loading}>
                                    getMessage
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    {/* Opérations sur les chaînes */}
                    <div style={styles.col}>
                        <div style={styles.card}>
                            <div style={styles.cardTitle}> Opérations sur les chaînes</div>
                            <label style={styles.label}>Chaîne 1</label>
                            <input 
                                type="text" 
                                placeholder="Ex: Solidity" 
                                value={chaine1}
                                onChange={(e) => setChaine1(e.target.value)}
                                style={styles.input}
                                disabled={loading}
                            />
                            <label style={styles.label}>Chaîne 2</label>
                            <input 
                                type="text" 
                                placeholder="Ex: Web3" 
                                value={chaine2}
                                onChange={(e) => setChaine2(e.target.value)}
                                style={styles.input}
                                disabled={loading}
                            />
                            <div style={styles.buttonGroup}>
                                <button onClick={concatenerHandler} style={styles.button} disabled={loading}>concatener</button>
                                <button onClick={concatenerAvecHandler} style={styles.button} disabled={loading}>concatenerAvec</button>
                                <button onClick={longueurHandler} style={styles.button} disabled={loading}>longueur</button>
                                <button onClick={comparerHandler} style={styles.button} disabled={loading}>comparer</button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div style={styles.resultBox}>
                    <div style={styles.resultTitle}> Résultat</div>
                    <div style={styles.resultText}>{result || "Cliquez sur un bouton pour voir le résultat"}</div>
                </div>
                
                <TransactionInfo 
                    web3={web3} 
                    transactionHash={transactionHash} 
                    contractName="GestionChaines.sol"
                    contractAbi={GestionChainesContract.abi}
                />
             
            </div>
        </div>
    );
}

export default Exercice3;