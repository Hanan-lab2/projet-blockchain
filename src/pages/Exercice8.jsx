// client/src/pages/Exercice8.jsx
import { useState, useEffect } from 'react';
import Web3 from 'web3';
import PaymentContract from '../contracts/Payment.json';
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
    colSmall: {
        flex: '0 0 220px'
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        padding: '24px',
        border: '1px solid #e9eef3',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        height: '100%'
    },
    cardSmall: {
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
    cardTitleCenter: {
        color: '#2a5298',
        marginBottom: '16px',
        fontSize: '18px',
        fontWeight: '600',
        borderLeft: '3px solid #2a5298',
        paddingLeft: '12px'
    },
    infoBox: {
        backgroundColor: '#f1f5f9',
        padding: '12px 16px',
        borderRadius: '12px',
        fontFamily: 'monospace',
        fontSize: '13px',
        overflowX: 'auto'
    },
    infoRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexWrap: 'wrap'
    },
    infoLabel: {
        fontWeight: '600',
        color: '#475569',
        whiteSpace: 'nowrap'
    },
    infoValue: {
        color: '#1e293b',
        fontFamily: 'monospace',
        wordBreak: 'break-all',
        flex: 1
    },
    inputGroup: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        width: '100%'
    },
    input: {
        flex: 1,
        padding: '10px 14px',
        borderRadius: '12px',
        border: '1px solid #cbd5e1',
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
        transition: 'all 0.2s',
        whiteSpace: 'nowrap'
    },
    buttonDanger: {
        backgroundColor: '#dc3545'
    },
    buttonContainer: {
        marginTop: '16px',
        display: 'flex',
        justifyContent: 'center'
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
    }
};

function Exercice8() {
    const [contract, setContract] = useState(null);
    const [web3, setWeb3] = useState(null);
    const [account, setAccount] = useState('');
    const [result, setResult] = useState('');
    const [montant, setMontant] = useState('');
    const [recipient, setRecipient] = useState('');
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
            const deployedNetwork = PaymentContract.networks[networkId];
            
            if (deployedNetwork) {
                const contractInstance = new web3Instance.eth.Contract(
                    PaymentContract.abi,
                    deployedNetwork.address
                );
                setContract(contractInstance);
                
                const recipientAddr = await contractInstance.methods.recipient().call();
                setRecipient(recipientAddr);
                
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

    async function receivePayment() {
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
            const montantEth = parseFloat(montant);
            if (isNaN(montantEth) || montantEth <= 0) {
                setResult(" Montant invalide (doit être > 0)");
                setLoading(false);
                return;
            }
            const montantWei = web3.utils.toWei(montantEth.toString(), 'ether');
            
            const tx = await contract.methods.receivePayment().send({
                from: account,
                value: montantWei
            });
            setTransactionHash(tx.transactionHash);
            setResult(` Paiement de ${montantEth} ETH reçu`);
            setMontant('');
        } catch (error) {
            setResult(" Erreur: " + error.message);
        }
        setLoading(false);
    }

    async function withdraw() {
        if (!contract) {
            setResult(" Contrat non initialisé");
            return;
        }
        setLoading(true);
        try {
            const tx = await contract.methods.withdraw().send({ from: account });
            setTransactionHash(tx.transactionHash);
            setResult(` Retrait effectué`);
        } catch (error) {
            setResult(" Erreur: " + error.message);
        }
        setLoading(false);
    }

    return (
        <div style={styles.container}>
            <div style={styles.content}>
                <h1 style={styles.title}>Exercice 8 : Payment - Transactions</h1>
                
                <BlockchainInfo 
                    web3={web3} 
                    contractAddress={contract?.options?.address}
                    account={account}
                />
                
                <div style={styles.row}>
                    {/*  Informations du contrat */}
                    <div style={styles.col}>
                        <div style={styles.card}>
                            <div style={styles.cardTitle}>Informations</div>
                            <div style={styles.infoBox}>
                                <div style={styles.infoRow}>
                                    <span style={styles.infoLabel}>recipient :</span>
                                    <span style={styles.infoValue}>{recipient}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/*  receivePayment() */}
                    <div style={styles.col}>
                        <div style={styles.card}>
                            <div style={styles.cardTitle}>receivePayment</div>
                            <div style={styles.inputGroup}>
                                <input 
                                    type="number" 
                                    step="0.01"
                                    placeholder="Montant en ETH" 
                                    value={montant}
                                    onChange={(e) => setMontant(e.target.value)}
                                    style={styles.input}
                                    disabled={loading}
                                />
                                <button style={styles.button} onClick={receivePayment} disabled={loading}>
                                    {loading ? "..." : "receivePayment"}
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    {/*  withdraw() */}
                    <div style={styles.colSmall}>
                        <div style={styles.cardSmall}>
                            <div style={styles.cardTitleCenter}>withdraw</div>
                            <div style={styles.buttonContainer}>
                                <button style={{...styles.button, ...styles.buttonDanger}} onClick={withdraw} disabled={loading}>
                                    {loading ? "..." : "withdraw"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div style={styles.resultBox}>
                    <div style={styles.resultTitle}>Résultat</div>
                    <div style={styles.resultText}>{result || "Cliquez sur un bouton pour voir le résultat"}</div>
                </div>
                
                <TransactionInfo 
                    web3={web3} 
                    transactionHash={transactionHash} 
                    contractName="Payment.sol"
                    contractAbi={PaymentContract.abi}
                />
                
            </div>
        </div>
    );
}

export default Exercice8;