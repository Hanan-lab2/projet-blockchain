// client/src/components/TransactionInfo.jsx
import { useState, useEffect } from 'react';
import Web3 from 'web3';

const styles = {
    container: {
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '24px',
        marginTop: '24px',
        fontFamily: 'monospace',
        fontSize: '13px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
    },
    title: {
        color: '#1a2c3e',
        marginBottom: '24px',
        fontSize: '20px',
        fontWeight: '700',
        letterSpacing: '-0.3px',
        textAlign: 'center'
    },
    section: {
        marginBottom: '24px',
        backgroundColor: '#f9fafb',
        borderRadius: '12px',
        padding: '16px 20px'
    },
    sectionTitle: {
        fontWeight: '700',
        color: '#2a5298',
        marginBottom: '14px',
        fontSize: '15px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        borderBottom: '2px solid #e2e8f0',
        paddingBottom: '8px'
    },
    row: {
        marginLeft: '8px',
        marginBottom: '10px',
        wordBreak: 'break-all',
        display: 'flex',
        flexWrap: 'wrap'
    },
    label: {
        fontWeight: '600',
        display: 'inline-block',
        width: '140px',
        verticalAlign: 'top',
        color: '#475569',
        fontSize: '12px'
    },
    value: {
        color: '#1e293b',
        display: 'inline-block',
        wordBreak: 'break-all',
        flex: 1,
        fontSize: '12px'
    },
    hashValue: {
        color: '#4a627a',
        display: 'inline-block',
        wordBreak: 'break-all',
        flex: 1,
        fontSize: '11px',
        fontFamily: 'monospace'
    },
    success: {
        color: '#10b981',
        fontWeight: '600'
    },
    error: {
        color: '#ef4444',
        fontWeight: '600'
    },
    offlineContainer: {
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '24px',
        marginTop: '24px',
        textAlign: 'center'
    },
    offlineTitle: {
        color: '#ef4444',
        marginBottom: '12px',
        fontSize: '16px',
        fontWeight: 'bold'
    }
};

function getFunctionSelector(signature) {
    const hash = Web3.utils.sha3(signature);
    return hash.substring(0, 10);
}

function TransactionInfo({ web3, transactionHash, contractName, contractAbi }) {
    const [transaction, setTransaction] = useState(null);
    const [receipt, setReceipt] = useState(null);
    const [block, setBlock] = useState(null);
    const [loading, setLoading] = useState(false);
    const [functionName, setFunctionName] = useState('');

    useEffect(() => {
        if (web3 && transactionHash) {
            fetchTransaction();
        }
    }, [web3, transactionHash]);

    async function fetchTransaction() {
        setLoading(true);
        try {
            const tx = await web3.eth.getTransaction(transactionHash);
            setTransaction(tx);
            
            if (tx && tx.input && tx.input !== '0x' && contractAbi) {
                const selector = tx.input.substring(0, 10);
                for (const item of contractAbi) {
                    if (item.type === 'function') {
                        const inputs = item.inputs.map(input => input.type).join(',');
                        const signature = `${item.name}(${inputs})`;
                        const calculatedSelector = getFunctionSelector(signature);
                        if (calculatedSelector === selector) {
                            const params = item.inputs.map(input => `${input.name}: ${input.type}`).join(', ');
                            setFunctionName(`${item.name}(${params})`);
                            break;
                        }
                    }
                }
            }
            
            const rcpt = await web3.eth.getTransactionReceipt(transactionHash);
            setReceipt(rcpt);
            
            if (tx && rcpt) {
                const blk = await web3.eth.getBlock(rcpt.blockNumber);
                setBlock(blk);
            }
        } catch (error) {
            console.error("Erreur transaction:", error);
        }
        setLoading(false);
    }

    function formatTimestamp(timestamp) {
        if (!timestamp) return 'N/A';
        const ts = typeof timestamp === 'bigint' ? Number(timestamp) : timestamp;
        const date = new Date(ts * 1000);
        return date.toLocaleString();
    }

    if (!transactionHash) {
        return null;
    }

    if (loading) {
        return (
            <div style={styles.container}>
                <div style={styles.title}> CHARGEMENT</div>
                <div style={styles.section}>
                    <div style={{ textAlign: 'center', color: '#64748b' }}>
                        Chargement de la transaction...
                    </div>
                </div>
            </div>
        );
    }

    if (!transaction) {
        return (
            <div style={styles.offlineContainer}>
                <div style={styles.offlineTitle}> Transaction non trouvée</div>
            </div>
        );
    }

    const transactionNumber = transaction.transactionIndex !== undefined && transaction.transactionIndex !== null 
        ? Number(transaction.transactionIndex) + 1 
        : 'N/A';

    return (
        <div style={styles.container}>
            <div style={styles.title}> DÉTAILS DE LA DERNIÈRE TRANSACTION</div>
            
            {/*  Informations générales */}
            <div style={styles.section}>
                <div style={styles.sectionTitle}> INFORMATIONS GÉNÉRALES</div>
                <div style={styles.row}>
                    <span style={styles.label}>Hash :</span>
                    <span style={styles.hashValue}>{transaction.hash}</span>
                </div>
                <div style={styles.row}>
                    <span style={styles.label}>Numéro :</span>
                    <span style={styles.value}>{transactionNumber}</span>
                </div>
                <div style={styles.row}>
                    <span style={styles.label}>Nonce :</span>
                    <span style={styles.value}>{transaction.nonce?.toString()}</span>
                </div>
                <div style={styles.row}>
                    <span style={styles.label}>Bloc :</span>
                    <span style={styles.value}>#{receipt?.blockNumber || 'N/A'}</span>
                </div>
                <div style={styles.row}>
                    <span style={styles.label}>Statut :</span>
                    <span style={receipt?.status ? styles.success : styles.error}>
                        {receipt?.status ? ' Succès' : ' Échec'}
                    </span>
                </div>
            </div>

            {/*  Acteurs */}
            <div style={styles.section}>
                <div style={styles.sectionTitle}> ACTEURS</div>
                <div style={styles.row}>
                    <span style={styles.label}>Expéditeur :</span>
                    <span style={styles.hashValue}>{transaction.from}</span>
                </div>
                <div style={styles.row}>
                    <span style={styles.label}>Destinataire :</span>
                    <span style={styles.hashValue}>{transaction.to || 'Création de contrat'}</span>
                </div>
                {contractName && (
                    <div style={styles.row}>
                        <span style={styles.label}>Contrat :</span>
                        <span style={styles.value}>{contractName}</span>
                    </div>
                )}
                {functionName && (
                    <div style={styles.row}>
                        <span style={styles.label}>Fonction :</span>
                        <span style={styles.value}>{functionName}</span>
                    </div>
                )}
            </div>

            {/*  Métriques */}
            <div style={styles.section}>
                <div style={styles.sectionTitle}> MÉTRIQUES</div>
                <div style={styles.row}>
                    <span style={styles.label}>Montant :</span>
                    <span style={styles.value}>{web3.utils.fromWei(transaction.value, 'ether')} ETH</span>
                </div>
                <div style={styles.row}>
                    <span style={styles.label}>Limite Gas :</span>
                    <span style={styles.value}>{transaction.gas?.toString()}</span>
                </div>
                {receipt && (
                    <div style={styles.row}>
                        <span style={styles.label}>Gas utilisé :</span>
                        <span style={styles.value}>{receipt.gasUsed?.toString()}</span>
                    </div>
                )}
                <div style={styles.row}>
                    <span style={styles.label}>Prix du Gas :</span>
                    <span style={styles.value}>{parseFloat(web3.utils.fromWei(transaction.gasPrice, 'gwei')).toFixed(4)} Gwei</span>
                </div>
            </div>

            {/*  Horodatage */}
            {block && (
                <div style={styles.section}>
                    <div style={styles.sectionTitle}> HORODATAGE</div>
                    <div style={styles.row}>
                        <span style={styles.label}>Timestamp :</span>
                        <span style={styles.value}>{formatTimestamp(block.timestamp)}</span>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TransactionInfo;