import React from 'react';
import styles from '../styles/mainPage.module.scss';
import { Card, Col, Row } from 'antd';
import { tabloStore } from '../Zustand/store';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API } from '../utils/utils';
import LOGO from '../assets/LOGO.png'

export const Main = () => {
  const getBranch = tabloStore((state) => state.getBranch);
  const brunches = tabloStore((state) => state.brunches);

  useEffect(() => {
    getBranch();
  }, []);

  console.log(brunches);

  return (


    <div className={styles.main__block}>
        <div className={styles.main__header}>
    <img className={styles.main__logo} src={LOGO} alt="logo"/>
</div>
      <Row gutter={30}>
      {brunches.map((branch) => (
          <Col className={styles.main__col} span={7} key={branch.id}>
            <Link to={`/${branch.id}`}>
              <Card title={branch.city} bordered={false}>
                {branch.address}
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </div>
  );
};
