import React from 'react';
import Header from '../../modules/headers/Header';
import styles from './AppLayout.module.scss';

export default function AppLayout({ children }) {
    return (
        <>
            <Header logo exit />
            <div className={styles.mainGrid}>
                <main>{children}</main>
            </div>
        </>
    );
}
