import {
  connect,
  // useSelector,
  useDispatch,
} from "react-redux";
import React, {
  // useCallback,
  memo,
  useEffect,
  useState,
  useImperativeHandle,
  useRef,
  useLayoutEffect,
  forwardRef,
} from "react";
import $ from "jquery";
import { Modal, Empty } from '@/component/common';
import { Scrollbars } from "react-custom-scrollbars";
import echarts from "echarts/lib/echarts";
import "echarts/lib/chart/bar";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
import "echarts/lib/component/legend";
import "echarts/lib/component/markPoint";
import "echarts/lib/component/dataZoom";
import fetch from "../../../util/fetch";
import ipConfig from "../../../util/ipConfig";
import { Loading } from "../../../component/common";

let { BasicProxy } = ipConfig;
// import { resizeForEcharts } from "../../../util/public";
function TeacherCount(props, ref) {
  let {
    currentClass,
    currentGrade,
    currentTerm,
    userIdentity,
    userInfo: {SchoolID},
    reflash
  } = props;
  const [countKindList, setCountKindList] = useState([
    '男生',
    '走读生',
    '独生子女',
    '留守儿童',
    '接受过学前教育',
    '贫困生',
    '女生',
    '住宿生',
    '非独生子女',
    '非留守儿童',
    '未接受过学前教育',
    '非贫困生'
  ])
  const [kindDataList, setKindDataList] = useState([]);
  // const [titleDom, setTitleDom] = useState("");
  const [titleDom, setTitleDom] = useState("");
  const [statusInfo, setStatusInfo] = useState({});
  const [currentKind, setCurrentKind] = useState({});
  const [isEmpty, setIsEmpty] = useState(false);
  const [loadVisible, setLoadVisible] = useState(true);
  const [stuStatusVisible, setStuStatusVisible] = useState(false);
  //弹出框学生列表
  const [modalStuList, setModalStuList] = useState([]);
  
  useLayoutEffect(() => {
    let url, classId = "", gradeId = "";
    if(userIdentity == "manager" && !SchoolID){
      return;
    }
    if(userIdentity == "teacher" && !currentClass){
      return;
    }
    // if(userIdentity == "manager" && !currentGrade ){
    //   return;
    // }
    if(userIdentity == "teacher"){
      url = BasicProxy + "/api/status/class?classId=" + currentClass;
    }
    if(userIdentity == "manager"){
      if(currentClass){
        url = BasicProxy + "/api/status/class?classId=" + currentClass;
      }
      if(!currentClass && currentGrade){
        url = BasicProxy + "/api/status/grade?gradeId=" + currentGrade;
      }
      if(!currentClass && !currentGrade){
        url = BasicProxy + "/api/status/school?schoolId=" + SchoolID;
      } 
    }
    setLoadVisible(true);
    fetch
    .get({url, securityLevel: 2})
    .then((res)=>res.json())
    .then((result)=>{
      if(result.status == 200 && result.data){
        let arr = [];
        countKindList.forEach((item)=>{
          if(item == "男生"){
            let obj = {
              key: item,
              num: result.data.maleNum,
              dataList: result.data.maleList
            };
            arr.push(obj);
          }
          if(item == "女生"){
            let obj = {
              key: item,
              num: result.data.femaleNum,
              dataList: result.data.femaleList
            };
            arr.push(obj);
          }
          if(item == "走读生"){
            let obj = {
              key: item,
              num: result.data.dayNum,
              dataList: result.data.dayList
            };
            arr.push(obj);
          }
          if(item == "住宿生"){
            let obj = {
              key: item,
              num: result.data.boardNum,
              dataList: result.data.boardList
            };
            arr.push(obj);
          }
          if(item == "独生子女"){
            let obj = {
              key: item,
              num: result.data.onlyChildNum,
              dataList: result.data.onlyChildList
            };
            arr.push(obj);
          }
          if(item == "非独生子女"){
            let obj = {
              key: item,
              num: result.data.notOnlyChildNum,
              dataList: result.data.notOnlyChildList
            };
            arr.push(obj);
          }
          if(item == "留守儿童"){
            let obj = {
              key: item,
              num: result.data.leftChildNum,
              dataList: result.data.leftChildList
            };
            arr.push(obj);
          }
          if(item == "非留守儿童"){
            let obj = {
              key: item,
              num: result.data.notLeftChildNum,
              dataList: result.data.notLeftChildList
            };
            arr.push(obj);
          }
          if(item == "接受过学前教育"){
            let obj = {
              key: item,
              num: result.data.acceptPreSchoolNum,
              dataList: result.data.acceptPreSchoolList
            };
            arr.push(obj);
          }
          if(item == "未接受过学前教育"){
            let obj = {
              key: item,
              num: result.data.notAcceptPreSchoolNum,
              dataList: result.data.notAcceptPreSchoolList	
            };
            arr.push(obj);
          }
          if(item == "贫困生"){
            let obj = {
              key: item,
              num: result.data.poorNum,
              dataList: result.data.poorList
            };
            arr.push(obj);
          }
          if(item == "非贫困生"){
            let obj = {
              key: item,
              num: result.data.notPoorNum,
              dataList: result.data.notPoorList
            };
            arr.push(obj);
          }
        })
        setStatusInfo(result.data);
        setKindDataList(arr);
      }
      setLoadVisible(false);
    })
  }, [currentClass, currentGrade, currentTerm, userIdentity, SchoolID, reflash])
  useEffect(()=>{
    if(!document.getElementById("age-position-echart")){
      return;
    }
    let ageData = [];
    //求出年龄分布
    for(let x in statusInfo.ageDistribution){
      let obj = {
        name: x,
        value: statusInfo.ageDistribution[x]
      }
      ageData.push(obj);
    }
    let myEchart = echarts.init(document.getElementById("age-position-echart"));
    myEchart.resize();
    let option = {
      tooltip: {
          trigger: 'item'
      },
      grid: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
      },
      title: {
          text: '年龄分布图',
          left: 'center',
          top: '85%',
          textStyle: {
              padding: [0, 0, 30, 0],
              fontSize: 14,
          }
      },
      backgroundColor: {
        type: 'radial',  //radial为镜像渐变， line为线性渐变
        x: 0.5,  //x，y控制渐变的圆心
        y: 0.45, 
        r: 0.35, //半径
        //颜色配置
        colorStops: [
          {
            offset: 0, //必须存在不能超过1，表示这一颜色的范围
            color: 'white', // 0% 处的颜色
          },
          {
            offset: 0.65,
            color: 'white',
          },
          {
            offset: 0.66,
            color: 'rgba(0, 0, 0, 0.05)',
          },
          {
            offset: 0.8,
            color: 'rgba(0, 0, 0, 0.05)',
          },
          {
            offset: 0.91,
            color: 'rgba(0, 0, 0, 0.05)',
          },
          {
            offset: 0.91,
            color: 'transparent',
          },
          {
            offset: 1,
            color: 'transparent', // 100% 处的颜色
          },
        ],
      },
      color: ['#89df89', '#f77575', '#71add8', '#2d3047', '#ffb782', 'pink'],
      series: [
        {
          type: 'pie',
          radius: ['25%', '60%'],
          center: ['50%', '45%'],
          minAngle: 25,
          avoidLabelOverlap: false,
          label: {
              show: true
          },
          emphasis: {
              itemStyle: {
                  borderWidth: 10,
                  borderColor: 'rgba(0, 0, 0, 0.05)'
              },
          },
          
          data: ageData
        }
      ]
    };         
    myEchart.setOption(option, true);
    window.addEventListener("resize", function(){
      myEchart.resize();
    })
  }, [statusInfo]);
  useEffect(()=>{
    if(!document.getElementById("native-position-echart")){
      return;
    }
    let nativePlace = [];
    //求出籍贯分布
    for(let x in statusInfo.nativePlaceDistribution){
      let obj = {
        name: x,
        value: statusInfo.nativePlaceDistribution[x]
      }
      nativePlace.push(obj);
    }
    let myEchart2 = echarts.init(document.getElementById("native-position-echart"));
    myEchart2.resize();
    let option2 = {
      tooltip: {
          trigger: 'item'
      },
      grid: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
      },
      title: {
          text: '籍贯分布图',
          left: 'center',
          top: '85%',
          textStyle: {
              padding: [0, 0, 30, 0],
              fontSize: 14,
          }
      },
      backgroundColor: {
        type: 'radial',  //radial为镜像渐变， line为线性渐变
        x: 0.5,  //x，y控制渐变的圆心
        y: 0.45, 
        r: 0.35, //半径
        //颜色配置
        colorStops: [
          {
            offset: 0, //必须存在不能超过1，表示这一颜色的范围
            color: 'white', // 0% 处的颜色
          },
          {
            offset: 0.65,
            color: 'white',
          },
          {
            offset: 0.66,
            color: 'rgba(0, 0, 0, 0.05)',
          },
          {
            offset: 0.8,
            color: 'rgba(0, 0, 0, 0.05)',
          },
          {
            offset: 0.91,
            color: 'rgba(0, 0, 0, 0.05)',
          },
          {
            offset: 0.91,
            color: 'transparent',
          },
          {
            offset: 1,
            color: 'transparent', // 100% 处的颜色
          },
        ],
      },
      color: ['#89df89', '#f77575', '#71add8', '#2d3047', '#ffb782', 'pink'],
      series: [
        {
          // name: '访问来源',
          type: 'pie',
          radius: ['25%', '60%'],
          center: ['50%', '45%'],
          minAngle: 25,
          avoidLabelOverlap: false,
          label: {
              show: true
          },
          emphasis: {
              itemStyle: {
                  borderWidth: 10,
                  borderColor: 'rgba(0, 0, 0, 0.05)'
              },
          },
          
          data: nativePlace
        }
      ]
    };             
    myEchart2.setOption(option2, true);
    window.addEventListener("resize", function(){
      myEchart2.resize();
    })
  }, [statusInfo]);
  useEffect(()=>{
    if(!document.getElementById("nation-position-echart")){
      return;
    }
    let nationData = [];
    //求出民族分布
    for(let x in statusInfo.nationDistribution){
      let obj = {
        name: x,
        value: statusInfo.nationDistribution[x]
      }
      nationData.push(obj);
    }
    let myEchart3 = echarts.init(document.getElementById("nation-position-echart"));
    myEchart3.resize();   
    let option3 = {
      tooltip: {
          trigger: 'item'
      },
      grid: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
      },
      title: {
          text: '民族分布图',
          left: 'center',
          top: '85%',
          textStyle: {
              padding: [0, 0, 30, 0],
              fontSize: 14,
          }
      },
      backgroundColor: {
        type: 'radial',  //radial为镜像渐变， line为线性渐变
        x: 0.5,  //x，y控制渐变的圆心
        y: 0.45, 
        r: 0.35, //半径
        //颜色配置
        colorStops: [
          {
            offset: 0, //必须存在不能超过1，表示这一颜色的范围
            color: 'white', // 0% 处的颜色
          },
          {
            offset: 0.65,
            color: 'white',
          },
          {
            offset: 0.66,
            color: 'rgba(0, 0, 0, 0.05)',
          },
          {
            offset: 0.8,
            color: 'rgba(0, 0, 0, 0.05)',
          },
          {
            offset: 0.91,
            color: 'rgba(0, 0, 0, 0.05)',
          },
          {
            offset: 0.91,
            color: 'transparent',
          },
          {
            offset: 1,
            color: 'transparent', // 100% 处的颜色
          },
        ],
      },
      color: ['#89df89', '#f77575', '#71add8', '#2d3047', '#ffb782', 'pink'],
      series: [
        {
          type: 'pie',
          radius: ['25%', '60%'],
          center: ['50%', '45%'],
          minAngle: 25,
          avoidLabelOverlap: false,
          label: {
              show: true
          },
          emphasis: {
              itemStyle: {
                  borderWidth: 10,
                  borderColor: 'rgba(0, 0, 0, 0.05)'
              },
          },
          
          data: nationData
        }
      ]
    };             

    myEchart3.setOption(option3, true);
    window.addEventListener("resize", function(){

      myEchart3.resize();
    })
  }, [statusInfo]);
  useEffect(()=>{
    if(!document.getElementById("nationality-position-echart")){
      return;
    }
    let nationality = [];
    //求出国籍分布
    for(let x in statusInfo.nationalityDistribution){
      let obj = {
        name: x,
        value: statusInfo.nationalityDistribution[x]
      }
      nationality.push(obj);
    }
    let myEchart4 = echarts.init(document.getElementById("nationality-position-echart"));
    myEchart4.resize();    
    let option4 = {
      tooltip: {
          trigger: 'item'
      },
      grid: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
      },
      title: {
          text: '国籍分布图',
          left: 'center',
          top: '85%',
          textStyle: {
              padding: [0, 0, 30, 0],
              fontSize: 14,
          }
      },
      backgroundColor: {
        type: 'radial',  //radial为镜像渐变， line为线性渐变
        x: 0.5,  //x，y控制渐变的圆心
        y: 0.45, 
        r: 0.35, //半径
        //颜色配置
        colorStops: [
          {
            offset: 0, //必须存在不能超过1，表示这一颜色的范围
            color: 'white', // 0% 处的颜色
          },
          {
            offset: 0.65,
            color: 'white',
          },
          {
            offset: 0.66,
            color: 'rgba(0, 0, 0, 0.05)',
          },
          {
            offset: 0.8,
            color: 'rgba(0, 0, 0, 0.05)',
          },
          {
            offset: 0.91,
            color: 'rgba(0, 0, 0, 0.05)',
          },
          {
            offset: 0.91,
            color: 'transparent',
          },
          {
            offset: 1,
            color: 'transparent', // 100% 处的颜色
          },
        ],
      },
      color: ['#89df89', '#f77575', '#71add8', '#2d3047', '#ffb782', 'pink'],
      series: [
        {
          type: 'pie',
          radius: ['25%', '60%'],
          center: ['50%', '45%'],
          minAngle: 25,
          avoidLabelOverlap: false,
          label: {
              show: true
          },
          emphasis: {
              itemStyle: {
                  borderWidth: 10,
                  borderColor: 'rgba(0, 0, 0, 0.05)'
              },
          },
          
          data: nationality
        }
      ]
    };           
    myEchart4.setOption(option4, true);
    window.addEventListener("resize", function(){
      myEchart4.resize();
    })
  }, [statusInfo]);
  // useEffect(()=>{
  //   setTitleDom(<p style={{padding: 0, margin: 0}}>学籍统计<span>-{currentKind.key}</span></p>);
  // }, [currentKind, modalStuList])
  let ageData = [];
  //求出年龄分布
  for(let x in statusInfo.ageDistribution){
    let obj = {
      name: x,
      value: statusInfo.ageDistribution[x]
    }
    ageData.push(obj);
  }
  let nativePlace = [];
    //求出籍贯分布
    for(let x in statusInfo.nativePlaceDistribution){
      let obj = {
        name: x,
        value: statusInfo.nativePlaceDistribution[x]
      }
      nativePlace.push(obj);
    }
    let nationData = [];
    //求出民族分布
    for(let x in statusInfo.nationDistribution){
      let obj = {
        name: x,
        value: statusInfo.nationDistribution[x]
      }
      nationData.push(obj);
    }
    let nationality = [];
    //求出国籍分布
    for(let x in statusInfo.nationalityDistribution){
      let obj = {
        name: x,
        value: statusInfo.nationalityDistribution[x]
      }
      nationality.push(obj);
    }
  return (
    <div className={`TeacherCount`}>
      <Loading
      opacity={false}
      tip="加载中..."
      spinning={loadVisible}>
        <div className="count-status">
        <div className="count-status-left">
          <div className="all-count">{
          userIdentity == "teacher"? 
          statusInfo.classSize:
          currentClass?
          statusInfo.classSize:
          currentGrade?
          statusInfo.gradeSize:
          statusInfo.schoolSize
        }</div>
          <p>总人数</p>
        </div>
        <div className="slice-line"></div>
        <div className="count-status-right">
          {
            Array.isArray(countKindList) &&
            // countKindList.map((item)=>{
              kindDataList.map((item, index)=>{
                
                return (
                  <div 
                  className={"count-kind-one " + (index > 5? "orange": "")}
                  key={index}
                  onClick={()=>{
                    setCurrentKind(item);
                    setModalStuList(item.dataList);
                    setStuStatusVisible(true);
                    setTimeout(() => {
                      $(".stu-member-info .ant-modal-title").append(
                        `<span class="modal-small-title">- ${item.key}</span>`
                      )
                    }, 100);
                    
                  }}
                  >
                    <p>{item.key}</p>
                    <p className="kind-one-num">{item.num}人</p>
                  </div>
                )
              })
              
            // })
          }
        </div>
      </div>
      
      </Loading>
      
      {
        ageData.length == 0 && nativePlace.length == 0 && nationality.length == 0 && nationData.length == 0?
        "":
        // <Empty
        // // className={"bar-empty"}
        // style={{margin: "20px 0"}}
        // title={"暂无数据"}
        // type={"4"}
        // ></Empty>:
        <div className="kind-position">
          <div className="x-line"></div>
          <div className="y-line"></div>
          <div className="age-position-echart" id="age-position-echart"></div>
          <div className="native-position-echart" id="native-position-echart"></div>
          <div className="nation-position-echart" id="nation-position-echart"></div>
          <div className="nationality-position-echart" id="nationality-position-echart"></div>
        </div>
      }
      
      <Modal
        type="1"
        title={"学籍统计"}
        visible={stuStatusVisible}
        onOk={()=>setStuStatusVisible(true)}
        onCancel={()=>setStuStatusVisible(false)}
        footer={null}
        // destroyOnClose={true}
        width={576}
        className="stu-member-info"
        bodyStyle={{height: 432 + 'px', padding: '20px 5px 20px 36px'}}
      >
        <p className="stu-count">共<span>{
          modalStuList.length
          }</span>人</p>
        <ul className="member-list">
          <Scrollbars 
          autoHeight
          autoHeightMax={350}>
            {
              modalStuList.length > 0?
              modalStuList.map((item, index)=>{
                return (
                <li key={index}>
                  <i className="user-header" style={{
                    backgroundImage:
                    (
                      item.photo?
                      item.photo:
                      ""
                    )
                  }}></i>
                  <p title={item.studentName}>{item.studentName}</p>
                </li>
                )
              }):
              <Empty
              className={"bar-empty"}
              style={{margin: "80px 0 0"}}
              title={"暂无数据"}
              type={"4"}
              ></Empty>
            }
          
          </Scrollbars>
          
        </ul>  
      </Modal>
    </div>
  );
}

const mapStateToProps = (state) => {
  let {
    commonData: { levelHash, userInfo },
  } = state;
  return { levelHash, userInfo };
};
export default connect(mapStateToProps)(memo(forwardRef(TeacherCount)));
