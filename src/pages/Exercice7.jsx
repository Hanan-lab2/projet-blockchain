// client/src/pages/Exercice7.jsx
import { useState, useEffect } from 'react';
import Web3 from 'web3';
import RectangleContract from '../contracts/Rectangle.json';
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
    displayGroup: {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '10px'
    },
    buttonGroup: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
        marginTop: '8px'
    },
    input: {
        padding: '10px 14px',
        borderRadius: '12px',
        border: '1px solid #cbd5e1',
        width: '100px',
        fontSize: '14px',
        outline: 'none',
        transition: 'all 0.2s'
    },
    button: {
        backgroundColor: '#2a5298',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
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
        lineHeight: '1.5',
        whiteSpace: 'pre-wrap'
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

function formatValue(value) {
    if (typeof value === 'bigint') {
        return Number(value);
    }
    return value;
}

function Exercice7() {
    const [contract, setContract] = useState(null);
    const [web3, setWeb3] = useState(null);
    const [account, setAccount] = useState('');
    const [result, setResult] = useState('');
    const [dx, setDx] = useState('');
    const [dy, setDy] = useState('');
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
            const deployedNetwork = RectangleContract.networks[networkId];
            
            if (deployedNetwork) {
                const contractInstance = new web3Instance.eth.Contract(
                    RectangleContract.abi,
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

    async function deplacerForme() {
        if (!contract) {
            setResult(" Contrat non initialisé");
            return;
        }
        if (dx === '' || dy === '') {
            setResult(" Veuillez saisir dx et dy");
            return;
        }
        setLoading(true);
        try {
            const deltaX = parseInt(dx);
            const deltaY = parseInt(dy);
            
            if (isNaN(deltaX) || isNaN(deltaY)) {
                setResult(" Veuillez saisir des nombres valides");
                setLoading(false);
                return;
            }
            
            const tx = await contract.methods.deplacerForme(deltaX, deltaY).send({ from: account });
            setTransactionHash(tx.transactionHash);
            setResult(` Déplacement de (${deltaX}, ${deltaY}) effectué`);
            setDx('');
            setDy('');
        } catch (error) {
            console.error("Erreur deplacerForme:", error);
            setResult(" Erreur: " + error.message);
        }
        setLoading(false);
    }

    async function afficherXY() {
        if (!contract) {
            setResult(" Contrat non initialisé");
            return;
        }
        setLoading(true);
        try {
            const xy = await contract.methods.afficheXY().call();
            const x = formatValue(xy[0]);
            const y = formatValue(xy[1]);
            setResult(` Coordonnées actuelles : (${x}, ${y})`);
            setTransactionHash('');
        } catch (error) {
            setResult(" Erreur: " + error.message);
        }
        setLoading(false);
    }

    async function afficherLoLa() {
        if (!contract) {
            setResult(" Contrat non initialisé");
            return;
        }
        setLoading(true);
        try {
            const lola = await contract.methods.afficheLoLa().call();
            const lo = formatValue(lola[0]);
            const la = formatValue(lola[1]);
            setResult(` Dimensions : longueur = ${lo}, largeur = ${la}`);
            setTransactionHash('');
        } catch (error) {
            setResult(" Erreur: " + error.message);
        }
        setLoading(false);
    }

    async function surface() {
        if (!contract) {
            setResult(" Contrat non initialisé");
            return;
        }
        setLoading(true);
        try {
            const surfaceValue = await contract.methods.surface().call();
            const val = formatValue(surfaceValue);
            setResult(` Surface : ${val}`);
            setTransactionHash('');
        } catch (error) {
            setResult(" Erreur: " + error.message);
        }
        setLoading(false);
    }

    async function afficheInfos() {
        if (!contract) {
            setResult(" Contrat non initialisé");
            return;
        }
        setLoading(true);
        try {
            const infos = await contract.methods.afficheInfos().call();
            setResult(` ${infos}`);
            setTransactionHash('');
        } catch (error) {
            setResult(" Erreur: " + error.message);
        }
        setLoading(false);
    }

    return (
        <div style={styles.container}>
            <div style={styles.content}>
                <h1 style={styles.title}> Exercice 7 : Héritage - Rectangle</h1>
                
                <BlockchainInfo 
                    web3={web3} 
                    contractAddress={contract?.options?.address}
                    account={account}
                />
                
                <div style={styles.row}>
                    {/*  Déplacer le rectangle */}
                    <div style={styles.col}>
                        <div style={styles.card}>
                            <div style={styles.cardTitle}> deplacerForme</div>
                            <div style={styles.displayGroup}>
                                <input 
                                    type="number" 
                                    placeholder="dx" 
                                    value={dx}
                                    onChange={(e) => setDx(e.target.value)}
                                    style={styles.input}
                                    disabled={loading}
                                />
                                <input 
                                    type="number" 
                                    placeholder="dy" 
                                    value={dy}
                                    onChange={(e) => setDy(e.target.value)}
                                    style={styles.input}
                                    disabled={loading}
                                />
                                <button style={styles.button} onClick={deplacerForme} disabled={loading}>
                                    {loading ? "..." : "deplacerForme"}
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    {/*  Getters */}
                    <div style={styles.col}>
                        <div style={styles.card}>
                            <div style={styles.cardTitle}> Getters</div>
                            <div style={styles.buttonGroup}>
                                <button style={styles.button} onClick={afficherXY} disabled={loading}>
                                    afficheXY
                                </button>
                                <button style={styles.button} onClick={afficherLoLa} disabled={loading}>
                                    afficheLoLa
                                </button>
                                <button style={styles.button} onClick={surface} disabled={loading}>
                                    surface
                                </button>
                                <button style={styles.button} onClick={afficheInfos} disabled={loading}>
                                    afficheInfos
                                </button>
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
                    contractName="Rectangle.sol"
                    contractAbi={RectangleContract.abi}
                />
                
            </div>
        </div>
    );
}

export default Exercice7;