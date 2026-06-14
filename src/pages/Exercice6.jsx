// client/src/pages/Exercice6.jsx
import { useState, useEffect } from 'react';
import Web3 from 'web3';
import Exercice6Contract from '../contracts/Exercice6.json';
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
    card: {
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        padding: '24px',
        border: '1px solid #e9eef3',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        marginBottom: '24px'
    },
    cardTitle: {
        color: '#2a5298',
        marginBottom: '16px',
        fontSize: '18px',
        fontWeight: '600',
        borderLeft: '3px solid #2a5298',
        paddingLeft: '12px'
    },
    inputGroup: {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '10px',
        marginBottom: '16px'
    },
    input: {
        padding: '10px 14px',
        borderRadius: '12px',
        border: '1px solid #cbd5e1',
        width: '200px',
        fontSize: '14px',
        outline: 'none',
        transition: 'all 0.2s'
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
    },
    row: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '24px'
    },
    col: {
        flex: 1,
        minWidth: '280px'
    }
};

function Exercice6() {
    const [contract, setContract] = useState(null);
    const [web3, setWeb3] = useState(null);
    const [account, setAccount] = useState('');
    const [result, setResult] = useState('');
    const [nombre, setNombre] = useState('');
    const [index, setIndex] = useState('');
    const [tableau, setTableau] = useState([]);
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
            const deployedNetwork = Exercice6Contract.networks[networkId];
            
            if (deployedNetwork) {
                const contractInstance = new web3Instance.eth.Contract(
                    Exercice6Contract.abi,
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

    async function afficherTableau() {
        if (!contract) {
            setResult(" Contrat non initialisé");
            return;
        }
        setLoading(true);
        try {
            const tab = await contract.methods.afficheTableau().call();
            const tabNumbers = tab.map(v => typeof v === 'bigint' ? Number(v) : v);
            setResult(` Tableau : [${tabNumbers.join(', ')}]`);
            setTransactionHash('');
        } catch (error) {
            setResult(" Erreur: " + error.message);
        }
        setLoading(false);
    }

    async function ajouterNombre() {
        if (!contract) {
            setResult(" Contrat non initialisé");
            return;
        }
        if (nombre === '') {
            setResult(" Veuillez saisir un nombre");
            return;
        }
        setLoading(true);
        try {
            const val = parseInt(nombre);
            if (isNaN(val)) {
                setResult(" Veuillez saisir un nombre valide");
                setLoading(false);
                return;
            }
            const tx = await contract.methods.ajouterNombre(val).send({ from: account });
            setTransactionHash(tx.transactionHash);
            setResult(` ${val} ajouté au tableau`);
            setNombre('');
        } catch (error) {
            setResult("Erreur: " + error.message);
        }
        setLoading(false);
    }

    async function getElement() {
        if (!contract) {
            setResult(" Contrat non initialisé");
            return;
        }
        if (index === '') {
            setResult(" Veuillez saisir un index");
            return;
        }
        setLoading(true);
        try {
            const idx = parseInt(index);
            if (isNaN(idx) || idx < 0) {
                setResult(" Index invalide");
                setLoading(false);
                return;
            }
            const element = await contract.methods.getElement(idx).call();
            const val = typeof element === 'bigint' ? Number(element) : element;
            setResult(`Élément à l'index ${idx} : ${val}`);
            setTransactionHash('');
        } catch (error) {
            setResult(" Erreur: " + error.message);
        }
        setLoading(false);
    }

    async function calculerSomme() {
        if (!contract) {
            setResult(" Contrat non initialisé");
            return;
        }
        setLoading(true);
        try {
            const somme = await contract.methods.calculerSomme().call();
            const val = typeof somme === 'bigint' ? Number(somme) : somme;
            setResult(` Somme du tableau : ${val}`);
            setTransactionHash('');
        } catch (error) {
            setResult(" Erreur: " + error.message);
        }
        setLoading(false);
    }

    return (
        <div style={styles.container}>
            <div style={styles.content}>
                <h1 style={styles.title}> Exercice 6 : Gestion d'un tableau de nombres</h1>
                
                <BlockchainInfo 
                    web3={web3} 
                    contractAddress={contract?.options?.address}
                    account={account}
                />
                
                <div style={styles.row}>
                    {/*  Afficher le tableau */}
                    <div style={styles.col}>
                        <div style={styles.card}>
                            <div style={styles.cardTitle}> Afficher le tableau</div>
                            <button style={styles.button} onClick={afficherTableau} disabled={loading}>
                                {loading ? "Chargement..." : "afficheTableau"}
                            </button>
                        </div>
                    </div>
                    
                    {/*  Ajouter un nombre */}
                    <div style={styles.col}>
                        <div style={styles.card}>
                            <div style={styles.cardTitle}> Ajouter un nombre</div>
                            <div style={styles.inputGroup}>
                                <input 
                                    type="number" 
                                    placeholder="Nombre à ajouter" 
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    style={styles.input}
                                    disabled={loading}
                                />
                                <button style={styles.button} onClick={ajouterNombre} disabled={loading}>
                                    {loading ? "Ajout..." : "ajouterNombre"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div style={styles.row}>
                    {/*  Obtenir un élément par index */}
                    <div style={styles.col}>
                        <div style={styles.card}>
                            <div style={styles.cardTitle}> Obtenir un élément</div>
                            <div style={styles.inputGroup}>
                                <input 
                                    type="number" 
                                    placeholder="Index" 
                                    value={index}
                                    onChange={(e) => setIndex(e.target.value)}
                                    style={styles.input}
                                    disabled={loading}
                                />
                                <button style={styles.button} onClick={getElement} disabled={loading}>
                                    {loading ? "Recherche..." : "getElement"}
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    {/*  Calculer la somme */}
                    <div style={styles.col}>
                        <div style={styles.card}>
                            <div style={styles.cardTitle}> Calculer la somme</div>
                            <button style={styles.button} onClick={calculerSomme} disabled={loading}>
                                {loading ? "Calcul..." : "calculerSomme"}
                            </button>
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
                    contractName="Exercice6.sol"
                    contractAbi={Exercice6Contract.abi}
                />
            </div>
        </div>
    );
}

export default Exercice6;