import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Avatar, Collapse, Typography, Divider } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import styles from './showList.module.css';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPublishSortAPI } from "../../api/service/userService";
import { fetchSoftVersionAPI } from "../../api/service/userService";

const { Panel } = Collapse;
const { Text } = Typography;

const SoftwareList = () => {
  const [expandedRow, setExpandedRow] = useState(null);
  const [softwareData, setSoftwareData] = useState([]); // 将 softwareData 移到这里，作为状态变量
  const [versionData, setVersionData] = useState([])
  const id = useSelector((state) => state.user.user.id);
  useEffect(() => {
    // 模拟软件数据（只用作示例）
    setSoftwareData([
      {
        "picture": "image1.jpg",
        "name": "Software A",
        "published_time": "2025-07-24 08:00:00"
      },
      {
        "picture": "image2.jpg",
        "name": "Software B",
        "published_time": "2025-07-23 10:00:00"
      }
    ]);


    // //模拟版本数据
    // setVersionData(
    //   [
    //     {
    //       picture: "version1.jpg",
    //       version: "v1.0",
    //       published_time: "2025-07-20 12:00:00",
    //       versionId: "1",
    //       introduction: "垃圾接口",
    //       price: "无价之宝",
    //     },
    //     {
    //       picture: "version2.jpg",
    //       version: "v1.1",
    //       published_time: "2025-07-22 09:00:00",
    //       versionId: "2",
    //       introduction: "垃圾接口",
    //       price: "无价之宝",
    //     }
    //   ]
    // )


    // 调用 fetchPublishSortAPI 获取数据
    const getData = async () => {
      try {
        const data = await fetchPublishSortAPI(id);
        setSoftwareData(data);  // 更新组件状态
      } catch (error) {
        console.error("获取数据失败:", error);
      }
    };
    getData();  // 组件挂载时调用 API
  }, []);  // 空依赖数组，表示只在组件挂载时调用一次

  //获取版本信息的函数
  const getVersion = async (softwarename) => {
    try {
      const data = await fetchSoftVersionAPI(softwarename);
      setVersionData(data);  // 更新组件状态
    } catch (error) {
      console.error("获取数据失败:", error);
    }
  };

  //处理列表折叠
  const handleExpandToggle = (softId) => {
    setExpandedRow(expandedRow === softId ? null : softId);
    getVersion(softId)
  };

  const navigate = useNavigate();
  function editorsoft(Id, intro, price) {
    navigate("editor", {
      state: { Id, intro, price },
    });

  }

  return (
    <div className={styles.softwareListContainer}>
      {softwareData.map((software) => (
        <div key={software.name} className={styles.softwareRow}>
          {/* 父行：头像，软件名称，创建日期 */}
          <Row justify="space-between" align="middle">
            <Col>
              <Avatar src={software.picture} size={50} />
            </Col>
            <Col flex="1" style={{ marginLeft: 20 }}>
              <Text strong>{software.name}</Text>
              <div>{software.published_time}</div>
            </Col>
            <Col>
              <Button
                type="primary"
                //这里传的是Id点击就能传递软件id去查看软件的各个版本
                onClick={() => handleExpandToggle(software.softId)}
                icon={expandedRow === software.softId ? <UpOutlined /> : <DownOutlined />}
              >
                {expandedRow === software.softId ? '收起' : '查看版本'}
              </Button>
            </Col>
          </Row>

          {expandedRow === software.softId && (
            <Collapse bordered={false}>
              <Panel header="版本信息" key="1">
                <ul>
                  {versionData.map((version, index) => (
                    <li key={index} className={styles.versionRow}>
                      <div className={styles.versionItem}>
                        <img src={version.picture} alt={"image"} className={styles.versionCover} />
                        <div className={styles.versionInfo}>
                          <span>{version.version}</span>
                          <div>{version.published_time}</div>
                        </div>
                        <Button type="link" onClick={() => editorsoft(version.versionId, version.introduction, version.price)}>修改版本信息</Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </Panel>
            </Collapse>
          )}
          <Divider />
        </div>
      ))}
    </div>
  );
};

export default SoftwareList;
