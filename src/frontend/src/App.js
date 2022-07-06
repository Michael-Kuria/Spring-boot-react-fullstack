import { useState, useEffect } from 'react';
import {deleteStudent, getAllStudents} from './client';
import { 
  Layout, 
  Menu, 
  Breadcrumb,
  Table,
  Spin,
  Alert,
  Empty,
  Button,
  Tag,
  Badge,
  Avatar,
  Popconfirm,
  Radio,
  Divider
 } from 'antd';
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
  PlusOutlined,
  DeleteFilled,
  EditFilled,
} from '@ant-design/icons';
import StudentDrawerForm from "./StudentDrawerForm";
import { errorNotification, successNotification } from './Notification';


const { Header, Content, Footer, Sider } = Layout;



function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items = [
  getItem('Option 1', '1', <PieChartOutlined />),
  getItem('Option 2', '2', <DesktopOutlined />),
  getItem('User', 'sub1', <UserOutlined />, [
    getItem('Tom', '3'),
    getItem('Bill', '4'),
    getItem('Alex', '5'),
  ]),
  getItem('Team', 'sub2', <TeamOutlined />, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
  getItem('Files', '9', <FileOutlined />),
];

const TheAvatar =({name}) =>{
  let trim = name.trim();
  
  if(trim.length === 0){
    return <Avatar icon={<UserOutlined />} />
  }

  const split = name.split(" ");

  if(split.length > 1){
    return <Avatar>{`${split[0].charAt(0)}${split[1].charAt(0)}`}</Avatar>
  }
  return <Avatar>{split[0].charAt(0)}</Avatar>
}


const removeStudent = (studentId,name, callback) => {

  deleteStudent(studentId).then( () => {
    successNotification(`${name} deleted successfully`,"")
    }).catch( err => {
      err.response.json().then(res => {
        console.log(res)
        errorNotification("There was an issue ", `${res.error} : ${res.message}`);
    })
  }).finally(() => callback())
  }

const columns = fetchStudents => [
  {
    title: '',
    dataIndex: 'avatar',
    key: 'avatar',
    render: (text,student) => <TheAvatar name={student.name}/>
  },
  {
    title: 'Id',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Gender',
    dataIndex: 'gender',
    key: 'gender',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Actions',
    dataIndex: 'actions',
    key: 'actions',
    render: (text,student) => 
    <Radio.Group>
      <Popconfirm
      title={`Are you sure to delete ${student.name}?`}
      onConfirm={() => removeStudent(student.id, student.name, fetchStudents)}
      okText="Yes"
      cancelText="No"
      >
        <Radio.Button value="delete"  >{<DeleteFilled />}</Radio.Button>
      </Popconfirm>
      <Radio.Button value="edit"  >{<EditFilled />}</Radio.Button>
    </Radio.Group>
  },
];

function App() {

  const [students, setStudents] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [showDrawer, setShowDrawer] = useState(false);

  const fetchStudents = () =>
  
    getAllStudents()
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setStudents(data);
      }).catch(err => {
        //console.log(err.response);
        err.response.json().then(res => {
          console.log(res)
          errorNotification("There was an error", `${res.error} : ${res.message}`)
        });
      }).finally(() => setFetching(false));
      
 useEffect(() => {
    console.log("Component is mounted");
    fetchStudents();
  },[]);
  
  const renderStudents = () => {
    if(fetching){
      return <Spin tip="Loading...">
        <Alert
        message="Loading Students"
        description="Students are being loaded."
        type="info"/>
      </Spin>
    }
    if(students.length <= 0){
       return <>
       <StudentDrawerForm
                showDrawer={showDrawer}
                setShowDrawer={setShowDrawer}
                fetchStudents={fetchStudents}
            />
        <Empty
          image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
          imageStyle={{height: 60, }} >
       <Button
              onClick={() => setShowDrawer(!showDrawer)}
              type="primary" shape="round" icon={<PlusOutlined/>} size="small">
              Add New Student
      </Button>
     </Empty>
       </>
    }else{
      return <>
            
            <StudentDrawerForm
                showDrawer={showDrawer}
                setShowDrawer={setShowDrawer}
                fetchStudents={fetchStudents}
            />
            <Table
                dataSource={students}
                columns={columns(fetchStudents)}
                bordered
                title={() =>
                    <>
                      <Tag>Number of students</Tag>
                      <Badge count={students.length} className="site-badge-count-4"/>
                      <br/> <br/>
                      <Button
                          onClick={() => setShowDrawer(!showDrawer)}
                          type="primary" shape="round" icon={<PlusOutlined/>} size="small">
                          Add New Student
                      </Button>
                    </>
                }
                pagination={{pageSize: 50}}
                scroll={{y: 500}}
                rowKey={student => student.id}
            />
        </>
    }
  }
  return <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
          <div className="logo" />
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
        </Sider>
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0 }} />
          <Content style={{ margin: '0 16px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>User</Breadcrumb.Item>
              <Breadcrumb.Item>Bill</Breadcrumb.Item>
            </Breadcrumb>
            <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
              {renderStudents()}
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            <Divider>
              <a target= "_blank" href="www.google.com">Google </a>
           </Divider>
          </Footer>
        </Layout>
      </Layout>
}

export default App;
