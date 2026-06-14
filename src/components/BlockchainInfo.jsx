
import { useState, useEffect } from 'react';

const styles = {
    container: {
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '24px',
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
        width: '100px',
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
    offlineContainer: {
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '24px',
        textAlign: 'center'
    },
    offlineTitle: {
        color: '#ef4444',
        marginBottom: '12px',
        fontSize: '16px',
        fontWeight: 'bold'
    }
};

function BlockchainInfo({ web3, contractAddress, account }) {
    const [block, setBlock] = useState(null);
    const [networkId, setNetworkId] = useState('');
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        if (web3) {
            getNetworkInfo();
            getBlockInfo();
            const interval = setInterval(() => {
                getBlockInfo();
            }, 10000);
            return () => clearInterval(interval);
        }
    }, [web3]);

    async function getNetworkInfo() {
        try {
            const id = await web3.eth.net.getId();
            setNetworkId(id);
            setConnected(true);
        } catch (error) {
            console.error("Erreur réseau:", error);
            setConnected(false);
        }
    }

    async function getBlockInfo() {
        try {
            const latestBlock = await web3.eth.getBlock('latest');
            setBlock(latestBlock);
        } catch (error) {
            console.error("Erreur bloc:", error);
        }
    }

    function formatTimestamp(timestamp) {
        if (!timestamp) return 'N/A';
        const ts = typeof timestamp === 'bigint' ? Number(timestamp) : timestamp;
        const date = new Date(ts * 1000);
        return date.toLocaleString();
    }

    if (!connected) {
        return (
            <div style={styles.offlineContainer}>
                <div style={styles.offlineTitle}> Connexion à Ganache</div>
                <div style={{ color: '#64748b', fontSize: '13px' }}>
                    Vérifie que Ganache est lancé sur http://127.0.0.1:7545
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.title}> INFORMATIONS BLOCKCHAIN</div>
            
            {/* Infos du réseau */}
            <div style={styles.section}>
                <div style={styles.sectionTitle}> INFOS DU RÉSEAU</div>
                <div style={styles.row}>
                    <span style={styles.label}>URL :</span>
                    <span style={styles.value}>HTTP://127.0.0.1:7545</span>
                </div>
                <div style={styles.row}>
                    <span style={styles.label}>ID :</span>
                    <span style={styles.value}>{networkId}</span>
                </div>
            </div>

            {/* Infos du contrat */}
            {contractAddress && account && (
                <div style={styles.section}>
                    <div style={styles.sectionTitle}> INFOS DU CONTRAT</div>
                    <div style={styles.row}>
                        <span style={styles.label}>Adresse :</span>
                        <span style={styles.hashValue}>{contractAddress}</span>
                    </div>
                    <div style={styles.row}>
                        <span style={styles.label}>Compte :</span>
                        <span style={styles.hashValue}>{account}</span>
                    </div>
                </div>
            )}
            
            {/* Infos du dernier bloc */}
            {block && (
                <div style={styles.section}>
                    <div style={styles.sectionTitle}> INFOS DU DERNIER BLOC</div>
                    <div style={styles.row}>
                        <span style={styles.label}>N° :</span>
                        <span style={styles.value}>#{block.number}</span>
                    </div>
                    <div style={styles.row}>
                        <span style={styles.label}>Hash :</span>
                        <span style={styles.hashValue}>{block.hash}</span>
                    </div>
                    <div style={styles.row}>
                        <span style={styles.label}>Timestamp :</span>
                        <span style={styles.value}>{formatTimestamp(block.timestamp)}</span>
                    </div>
                    <div style={styles.row}>
                        <span style={styles.label}>parentHash :</span>
                        <span style={styles.hashValue}>{block.parentHash}</span>
                    </div>
                    <div style={styles.row}>
                        <span style={styles.label}>nonce :</span>
                        <span style={styles.value}>{block.nonce || 'N/A'}</span>
                    </div>
                    <div style={styles.row}>
                        <span style={styles.label}>transactions :</span>
                        <span style={styles.value}>{block.transactions?.length || 0}</span>
                    </div>
                    <div style={styles.row}>
                        <span style={styles.label}>miner :</span>
                        <span style={styles.hashValue}>{block.miner || '0x0000000000000000000000000000000000000000'}</span>
                    </div>
                    <div style={styles.row}>
                        <span style={styles.label}>difficulty :</span>
                        <span style={styles.value}>{block.difficulty || '0'}</span>
                    </div>
                    <div style={styles.row}>
                        <span style={styles.label}>gasLimit :</span>
                        <span style={styles.value}>{block.gasLimit?.toString()}</span>
                    </div>
                    <div style={styles.row}>
                        <span style={styles.label}>gasUsed :</span>
                        <span style={styles.value}>{block.gasUsed?.toString()}</span>
                    </div>
                    <div style={styles.row}>
                        <span style={styles.label}>size :</span>
                        <span style={styles.value}>{block.size} bytes</span>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BlockchainInfo;