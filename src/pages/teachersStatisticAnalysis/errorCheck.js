import {
    connect,
    // useSelector,
    useDispatch,
    useStore,
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
import "./index.scss";
import { Empty } from "../../component/common";
import { Upload, Pagination, ConfigProvider, message, Tooltip } from "antd";
import zhCN from "antd/es/locale/zh_CN";
import fetch from "../../util/fetch";
import ipConfig from "../../util/ipConfig";
let { BasicProxy } = ipConfig;

function ErrorCheck(props, ref) {
    let {
        setShowType,
        basePlatFormMsg: { ProVersion },
        ModuleID,
        currentClass,
        currentGrade,
        userInfo: {SchoolID},
        ModuleType,
        checkList,
        setReflashError,
        reflashError
    } = props;
    //当前展示的学籍数据
    const [currentStatus, setCurrentStatus] = useState({});
    //纠错数据
    const [errorStatus, setErrorStatus] = useState({});
    //记录学习经历被修改的数据
    const [resumeModifyList, setResumeModifyList] = useState([]);
    //记录家庭监护人被修改的数据
    const [familyModifyList, setFamilyModifyList] = useState([]);
    //分页器当前页数
    const [currentIndex, setCurrentIndex] = useState(1);
    //checkList即纠错信息列表
    useLayoutEffect(()=>{
        if(Array.isArray(checkList) && checkList[currentIndex - 1]){
            setCurrentStatus(checkList[currentIndex - 1]);
            if(checkList[currentIndex - 1].errorCorrection){
                setErrorStatus(JSON.parse(checkList[currentIndex - 1].errorCorrection));
            }
            
        }
    }, [checkList, currentIndex]);
    //操作纠错信息
    const operateStatus = (type) => {
        //type: 0不通过，1通过
        if(type == 1){
            let arr = [];
            arr.push(currentStatus);
            let url = BasicProxy + "/api/status/student";
            fetch
            .put({
                url, 
                securityLevel: 2, 
                body: arr, 
                header: {
                "Content-Type": "application/json"
                }
            })
            .then((res)=>res.json())
            .then((result)=>{
                if(result.status == 200){
                    let url = BasicProxy + "/api/status/student/correction?studentIds=" + 
                    (checkList[currentIndex - 1]? checkList[currentIndex - 1].studentId: "");
                    fetch
                    .delete({url, securityLevel: 2})
                    .then((res)=>res.json())
                    .then((result)=>{
                        message.success("操作成功~");
                        setShowType("detail");
                        setReflashError(!reflashError);
                    })
                }
            })
        }
        if(type == 0){
            let url = BasicProxy + "/api/status/student/correction";
            fetch
            .delete({url, securityLevel: 2, body: {
                studentIds: (checkList[currentIndex - 1]? checkList[currentIndex - 1].studentId: "")
            }})
            .then((res)=>res.json())
            .then((result)=>{
                if(result.status == 200){
                    let url = BasicProxy + "/api/status/student/correction?studentIds=" + 
                    (checkList[currentIndex - 1]? checkList[currentIndex - 1].studentId: "");
                    fetch
                    .delete({url, securityLevel: 2})
                    .then((res)=>res.json())
                    .then((result)=>{
                        message.success("操作成功~");
                        setShowType("detail");
                        setReflashError(!reflashError);
                    })
                }
            })
        }
    }
    useEffect(()=>{
        //标红纠错信息
        if(JSON.stringify(currentStatus) == "{}"){
            return;
        }
        let tdList = $(".error-page td");
        let finalObj = Object.assign({}, {...currentStatus});
        for(let value in errorStatus){
            if(value != "resumeList" && value != "guardianList" && value != "extraInfo"){
                tdList.each((index, item)=>{
                    if($(item).attr("data-value") == value){
                        $(item).css({
                            color: 'red',
                            textDecoration: 'underline'
                        })
                        let text = $(item).text();
                        $(item).attr('title', '原：' + text + "\n" + "改：" + errorStatus[value]);
                        $(item).text(errorStatus[value]);
                        // let obj = currentStatus;
                        finalObj[value] = errorStatus[value];
                        // setCurrentStatus(obj);
                    }
                })
            }
            if(value == "extraInfo"){
                let extraInfo = errorStatus[value];
                console.log(extraInfo, "额外信息", typeof extraInfo);
                let obj = Object.assign({}, {...currentStatus});
                obj.extraInfo = obj.extraInfo? JSON.parse(obj.extraInfo): {};
                for(let key in extraInfo){
                    tdList.each((index, item)=>{
                        if($(item).attr("data-value") == key){
                            $(item).css({
                                color: 'red',
                                textDecoration: 'underline'
                            })
                            let text = $(item).text();
                            $(item).attr('title', '原：' + text + "\n" + "改：" + extraInfo[key]);
                            $(item).text(extraInfo[key]);
                            obj.extraInfo[key] = extraInfo[key] && extraInfo[key];  
                        }
                    })
                }
                finalObj.extraInfo = JSON.stringify(obj.extraInfo);

                // setCurrentStatus(obj);
            }
            if(value == "resumeList"){
                let resumeList = JSON.parse(errorStatus[value]);
                //标红并记录未改前数据
                let arr = [];
                resumeList.forEach((item, index)=>{
                    let obj = {};
                    if(currentStatus.resumeJson && currentStatus.resumeJson[index]){
                        for(let key in item){
                            if(item[key] != currentStatus.resumeJson[index][key]){
                                obj[key] = currentStatus.resumeJson[index][key];
                            }
                        }
                    } else {
                        obj = {...item};
                        for(let key in obj){
                            obj[key] = "无";
                        }
                    }
                    arr.push(obj);
                })
                setResumeModifyList(arr);
                //修改数据
                // let obj = Object.assign({}, {...currentStatus});
                finalObj.resume = errorStatus[value];
                finalObj.resumeJson = resumeList;
                // console.log(resumeList, "学习", obj);
                // setCurrentStatus(obj);
            }
            if(value == "guardianList"){
                let guardianList = JSON.parse(errorStatus[value]);
                 //标红并记录未改前数据
                 let arr = [];
                 console.log(guardianList)
                 guardianList.forEach((item, index)=>{
                     let obj = {};
                     if(currentStatus.guardianJson && currentStatus.guardianJson[index]){
                         for(let key in item){
                             if(item[key] != currentStatus.guardianJson[index][key]){
                                 obj[key] = currentStatus.guardianJson[index][key];
                             }
                         }
                     } else {
                         obj = {...item};
                         for(let key in obj){
                             obj[key] = "无";
                         }
                     }
                     arr.push(obj);
                 })
                 setFamilyModifyList(arr);
                 //修改数据
                // let obj = Object.assign({}, {...currentStatus});
                finalObj.guardian = errorStatus[value];
                finalObj.guardianJson = guardianList;
                // setCurrentStatus(obj);
            }
        }
        setCurrentStatus(finalObj);
    }, [errorStatus, currentIndex, checkList])
    return (
        <div className="error-page">
            <div className="import-top">
                学籍纠错审核
                <div className="btn-group">
                    <div className="reject-btn" onClick={()=>operateStatus(0)}>不通过</div>
                    <div className="agree-btn" onClick={()=>operateStatus(1)}>通过</div>
                </div>
                {/* <div className="goback" onClick={()=>setShowType("detail")}>返回详情界面</div> */}
            </div>
            <div className="preview-file">
                <div className="preview-top">
                    <ConfigProvider locale={zhCN}>
                        <Pagination
                        className="preview-pagination"
                        size="small"
                        total={checkList.length}
                        current={currentIndex}
                        pageSize={1}
                        showQuickJumper={true}
                        showSizeChanger={false}
                        hideOnSinglePage
                        onChange={(pageIndex)=>{
                            setCurrentStatus(checkList[pageIndex - 1]);
                            setCurrentIndex(pageIndex)
                        }}
                        />
                    </ConfigProvider>
                </div>
                <div className="stu-status" style={{padding: 0}}>
                    <table className="base-info" border="1" borderColor="#b7e1e5">
                        <caption>基本信息及辅助信息</caption>
                        <tr>
                            <td>姓名</td>
                            {/* <Tooltip
                                trigger="hover"
                                overlayClassName="error-container"
                                placement="bottomRight"
                                title={

                                    <div className="error-tips">
                                        <p>原：<span>{currentStatus.studentName? currentStatus.studentName: "--"}</span></p>
                                        <p>改：<span>{currentStatus.studentName? currentStatus.studentName: "--"}</span></p>
                                    </div>
                                }> */}
                                <td title={currentStatus.studentName? currentStatus.studentName: "--"} data-value="studentName">
                                    {currentStatus.studentName? currentStatus.studentName: "--"}
                                </td> 
                                {/* </Tooltip> */}
                            <td>性别</td>
                            <td title={currentStatus.gender? currentStatus.gender: "--"} data-value="gender">
                                {currentStatus.gender? currentStatus.gender: "--"}
                            </td>
                            <td>出生日期</td>
                            <td title={currentStatus.dateOfBirth? currentStatus.dateOfBirth: "--"} data-value="dateOfBirth">
                                {currentStatus.dateOfBirth? currentStatus.dateOfBirth: "--"}
                            </td>
                            <td>出生地</td>
                            <td title={currentStatus.extraInfoJson && currentStatus.extraInfoJson["出生地"]?
                            currentStatus.extraInfoJson["出生地"]: "--"} data-value="出生地">
                                {currentStatus.extraInfoJson && currentStatus.extraInfoJson["出生地"]?
                                currentStatus.extraInfoJson["出生地"]: "--"}
                            </td> 
                        <td rowSpan="6" style={{
                            backgroundImage: `url(${currentStatus.photoPath})`,
                            backgroundSize: '100% 100%'
                            }}></td>
                        </tr>
                        <tr>
                            <td>籍贯</td>
                            <td title={currentStatus.nativePlace? currentStatus.nativePlace: "--"} data-value="nativePlace">
                                {currentStatus.nativePlace? currentStatus.nativePlace: "--"}
                            </td>
                            <td>民族</td>
                            <td title={currentStatus.nation? currentStatus.nation: "--"} data-value="nation">
                                {currentStatus.nation? currentStatus.nation: "--"}
                            </td>
                            <td>国籍/地区</td>
                            <td title={currentStatus.nationality? currentStatus.nationality: "--"} data-value="nationality">
                                {currentStatus.nationality? currentStatus.nationality: "--"}
                            </td>
                            <td>身份证件类型</td>
                            <td title={currentStatus.extraInfoJson && currentStatus.extraInfoJson["身份证件类型"]?
                            currentStatus.extraInfoJson["身份证件类型"]: "--"} data-value="身份证件类型">
                                {currentStatus.extraInfoJson && currentStatus.extraInfoJson["身份证件类型"]?
                                currentStatus.extraInfoJson["身份证件类型"]: "--"}
                            </td> 
                        </tr>
                        <tr>
                            <td>身份证件号码</td>
                            <td colSpan="3" title={currentStatus.identityNum? currentStatus.identityNum: "--"} data-value="identityNum">
                                {currentStatus.identityNum? currentStatus.identityNum: "--"}
                            </td>
                            <td>港澳台侨胞</td>
                            <td title={currentStatus.overseaPeople? currentStatus.overseaPeople: "--"} data-value="overseaPeople">
                                {currentStatus.overseaPeople? currentStatus.overseaPeople: "--"}
                            </td>
                            <td>政治面貌</td>
                            <td title={currentStatus.extraInfoJson && currentStatus.extraInfoJson["政治面貌"]?
                            currentStatus.extraInfoJson["政治面貌"]: "--"} data-value="政治面貌">
                                {currentStatus.extraInfoJson && currentStatus.extraInfoJson["政治面貌"]?
                                currentStatus.extraInfoJson["政治面貌"]: "--"}
                            </td>
                        </tr>
                        <tr>
                            <td>健康状况</td>
                            <td title={currentStatus.extraInfoJson && currentStatus.extraInfoJson["健康状况"]?
                            currentStatus.extraInfoJson["健康状况"]: "--"} data-value="健康状况">
                                {currentStatus.extraInfoJson && currentStatus.extraInfoJson["健康状况"]?
                                currentStatus.extraInfoJson["健康状况"]: "--"}
                            </td>
                            <td>姓名拼音</td>
                            <td title={currentStatus.extraInfoJson && currentStatus.extraInfoJson["姓名拼音"]?
                            currentStatus.extraInfoJson["姓名拼音"]: "--"} data-value="姓名拼音">
                                {currentStatus.extraInfoJson && currentStatus.extraInfoJson["姓名拼音"]?
                                currentStatus.extraInfoJson["姓名拼音"]: "--"}
                            </td>
                            <td>曾用名</td>
                            <td title={currentStatus.formerName? currentStatus.formerName: "--"} data-value="formerName">
                                {currentStatus.formerName? currentStatus.formerName: "--"}
                            </td>
                            <td>身份证件有效期</td>
                            <td title={currentStatus.extraInfoJson && currentStatus.extraInfoJson["身份证件有效期"]?
                            currentStatus.extraInfoJson["身份证件有效期"]: "--"} data-value="身份证件有效期">
                                {currentStatus.extraInfoJson && currentStatus.extraInfoJson["身份证件有效期"]?
                                currentStatus.extraInfoJson["身份证件有效期"]: "--"}
                            </td> 
                        </tr>
                        <tr>
                            <td>户口所在地</td>
                            <td title={currentStatus.censusPlace? currentStatus.censusPlace: "--"} data-value="censusPlace">
                                {currentStatus.censusPlace? currentStatus.censusPlace: "--"}
                            </td>
                            <td>特长</td>
                            <td colSpan="5" title={currentStatus.extraInfoJson && currentStatus.extraInfoJson["特长"]?
                            currentStatus.extraInfoJson["特长"]: "--"} data-value="特长">
                                {currentStatus.extraInfoJson && currentStatus.extraInfoJson["特长"]?
                                currentStatus.extraInfoJson["特长"]: "--"}
                            </td>
                        </tr>
                        <tr>
                            <td>学籍辅号</td>
                            <td title={currentStatus.studentId? currentStatus.studentId: "--"} data-value="studentId">
                                {currentStatus.studentId? currentStatus.studentId: "--"}
                            </td>
                            <td>班内学号</td>
                            <td title={currentStatus.extraInfoJson && currentStatus.extraInfoJson["班内学号"]?
                            currentStatus.extraInfoJson["班内学号"]: "--"} data-value="班内学号">
                                {currentStatus.extraInfoJson && currentStatus.extraInfoJson["班内学号"]?
                                currentStatus.extraInfoJson["班内学号"]: "--"}
                            </td>
                            <td>年级</td>
                            <td title={currentStatus.gradeName? currentStatus.gradeName: "--"} data-value="gradeName">
                                {currentStatus.gradeName? currentStatus.gradeName: "--"}
                            </td>
                            <td>班级</td>
                            <td title={currentStatus.className? currentStatus.className: "--"} data-value="className">
                                {currentStatus.className? currentStatus.className: "--"}
                            </td> 
                        </tr>
                        <tr>
                            <td>入学年月</td>
                            <td title={currentStatus.extraInfoJson && currentStatus.extraInfoJson["入学年月"]?
                            currentStatus.extraInfoJson["入学年月"]: "--"} data-value="入学年月">
                                {currentStatus.extraInfoJson && currentStatus.extraInfoJson["入学年月"]?
                                currentStatus.extraInfoJson["入学年月"]: "--"}
                            </td>
                            <td>入学方式</td>
                            <td title={currentStatus.extraInfoJson && currentStatus.extraInfoJson["入学方式"]?
                            currentStatus.extraInfoJson["入学方式"]: "--"} data-value="入学方式">
                                {currentStatus.extraInfoJson && currentStatus.extraInfoJson["入学方式"]?
                                currentStatus.extraInfoJson["入学方式"]: "--"}
                            </td>
                            <td>就读方式</td>
                            <td title={currentStatus.studyingWay?
                            currentStatus.studyingWay: "--"} data-value="studyingWay">
                                {currentStatus.studyingWay?
                                currentStatus.studyingWay: "--"}
                            </td>
                            <td>学生来源</td>
                            <td colSpan="2" title={currentStatus.extraInfoJson && currentStatus.extraInfoJson["学生来源"]?
                            currentStatus.extraInfoJson["学生来源"]: "--"} data-value="学生来源">
                                {currentStatus.extraInfoJson && currentStatus.extraInfoJson["学生来源"]?
                                currentStatus.extraInfoJson["学生来源"]: "--"}
                            </td> 
                        </tr>
                    </table>
                    <table className="person-link" border="1" borderColor="#b7e1e5">
                        <caption>个人联系方式</caption>
                        <tr>
                            <td>现住址</td>
                            <td colSpan="3" title={currentStatus.extraInfoJson && currentStatus.extraInfoJson["现住址"]?
                            currentStatus.extraInfoJson["现住址"]: "--"} data-value="现住址">
                                {currentStatus.extraInfoJson && currentStatus.extraInfoJson["现住址"]?
                                currentStatus.extraInfoJson["现住址"]: "--"}
                            </td>
                            <td>通信地址</td>
                            <td colSpan="3" title={currentStatus.extraInfoJson && currentStatus.extraInfoJson["通讯地址"]?
                            currentStatus.extraInfoJson["通讯地址"]: "--"} data-value="通讯地址">
                                {currentStatus.extraInfoJson && currentStatus.extraInfoJson["通讯地址"]?
                                currentStatus.extraInfoJson["通讯地址"]: "--"}
                            </td>
                        </tr>
                        <tr>
                            <td>家庭地址</td>
                            <td colSpan="3" title={currentStatus.homeAddress? currentStatus.homeAddress: "--"} data-value="censusPlace">
                                {currentStatus.homeAddress? currentStatus.homeAddress: "--"}
                            </td>
                            <td>联系电话</td>
                            <td title={currentStatus.extraInfoJson && currentStatus.extraInfoJson["联系电话"]?
                            currentStatus.extraInfoJson["联系电话"]: "--"} data-value="联系电话">
                                {currentStatus.extraInfoJson && currentStatus.extraInfoJson["联系电话"]?
                                currentStatus.extraInfoJson["联系电话"]: "--"}
                            </td>
                            <td>邮政编码</td>
                            <td title={currentStatus.extraInfoJson && currentStatus.extraInfoJson["邮政编号"]?
                            currentStatus.extraInfoJson["邮政编号"]: "--"} data-value="邮政编号">
                                {currentStatus.extraInfoJson && currentStatus.extraInfoJson["邮政编号"]?
                                currentStatus.extraInfoJson["邮政编号"]: "--"}
                            </td>
                        </tr>
                        <tr>
                            <td>电子邮箱</td>
                            <td colSpan="3" title={currentStatus.extraInfoJson && currentStatus.extraInfoJson["电子邮箱"]?
                            currentStatus.extraInfoJson["电子邮箱"]: "--"} data-value="电子邮箱">
                                {currentStatus.extraInfoJson && currentStatus.extraInfoJson["电子邮箱"]?
                                currentStatus.extraInfoJson["电子邮箱"]: "--"}
                            </td>
                            <td>主页地址</td>
                            <td colSpan="3" title={currentStatus.extraInfoJson && currentStatus.extraInfoJson["主页地址"]?
                            currentStatus.extraInfoJson["主页地址"]: "--"} data-value="主页地址">
                                {currentStatus.extraInfoJson && currentStatus.extraInfoJson["主页地址"]?
                                currentStatus.extraInfoJson["主页地址"]: "--"}
                            </td>
                        </tr>
                    </table>
                    <table className="person-more-info" border="1" borderColor="#b7e1e5">
                        <caption>个人扩展信息</caption>
                        <tr>
                            <td width="200">是否独生子女</td>
                            <td width="85" data-value="isOnlychild">{currentStatus.isOnlychild? currentStatus.isOnlychild: "--"}</td>
                            <td width="200">是否受过学前教育</td>
                            <td width="85" data-value="isAcceptpreschool">{currentStatus.isAcceptpreschool? currentStatus.isAcceptpreschool: "--"}</td>
                            <td width="200">是否留守儿童</td>
                            <td width="85" data-value="isLeftbehindchild">{currentStatus.isLeftbehindchild? currentStatus.isLeftbehindchild: "--"}</td>
                            <td width="200">是否进城务工人员随迁子女</td>
                            <td width="85" data-value="是否进城务工人员随迁子女">{currentStatus.extraInfoJson && currentStatus.extraInfoJson["是否进城务工人员随迁子女"]?
                            currentStatus.extraInfoJson["是否进城务工人员随迁子女"]: "--"}</td>
                        </tr>
                        <tr>
                            <td width="200">是否孤儿</td>
                            <td width="85" data-value="是否孤儿">{currentStatus.extraInfoJson && currentStatus.extraInfoJson["是否孤儿"]?
                            currentStatus.extraInfoJson["是否孤儿"]: "--"}</td>
                            <td width="200">是否烈士或优抚子女</td>
                            <td width="85" data-value="是否烈士或优抚子女">{currentStatus.extraInfoJson && currentStatus.extraInfoJson["是否烈士或优抚子女"]?
                            currentStatus.extraInfoJson["是否烈士或优抚子女"]: "--"}</td>
                            <td width="200">随班就读</td>
                            <td width="85" data-value="随班就读">{currentStatus.extraInfoJson && currentStatus.extraInfoJson["随班就读"]?
                            currentStatus.extraInfoJson["随班就读"]: "--"}</td>
                            <td width="200">是否需要申请资助</td>
                            <td width="85" data-value="是否需要申请资助">{currentStatus.extraInfoJson && currentStatus.extraInfoJson["是否需要申请资助"]?
                            currentStatus.extraInfoJson["是否需要申请资助"]: "--"}</td>
                        </tr>
                        <tr>
                            <td width="200">是否享受一补</td>
                            <td width="85" data-value="是否享受一补">{currentStatus.extraInfoJson && currentStatus.extraInfoJson["是否享受一补"]?
                            currentStatus.extraInfoJson["是否享受一补"]: "--"}</td>
                            <td width="200">残疾人类型</td>
                            <td colSpan="5" data-value="残疾人类型">{currentStatus.extraInfoJson && currentStatus.extraInfoJson["残疾人类型"]?
                            currentStatus.extraInfoJson["残疾人类型"]: "--"}</td>
                        </tr>
                    </table>
                    <table className="study-status" border="1" borderColor="#b7e1e5">
                        <caption>学习经历</caption>
                        <tr>
                            <th width="148">学习起始时间</th>
                            <th width="148">学习结束时间</th>
                            <th width="395">学习单位</th>
                            <th width="160">学习内容</th>
                            <th width="140">担任职务</th>
                            <th width="150">学习证明人</th>
                        </tr>
                        {
                            Array.isArray(currentStatus.resumeJson) &&
                            currentStatus.resumeJson.map((item, index)=>{
                                console.log(resumeModifyList, currentStatus);
                                return (
                                    <tr key={index}>
                                        <td 
                                        width="148"
                                        style={{
                                            color:(resumeModifyList[index] &&
                                            resumeModifyList[index].semesterStartTime?"red":"")
                                        }}
                                        title={(resumeModifyList[index] &&
                                        resumeModifyList[index].semesterStartTime? 
                                        `原：${resumeModifyList[index].semesterStartTime}\n改：${item.semesterStartTime}`: item.semesterStartTime)}
                                        >{item.semesterStartTime? item.semesterStartTime: "--"}</td>
                                        <td width="148"
                                        style={{
                                            color:(resumeModifyList[index] &&
                                            resumeModifyList[index].semesterStartTime?"red":"")
                                        }}
                                        title={(resumeModifyList[index] &&
                                        resumeModifyList[index].semesterStartTime? 
                                        `原：${resumeModifyList[index].semesterStartTime}\n改：${item.semesterStartTime}`: item.semesterStartTime)}
                                        >{item.semesterEndTime? item.semesterEndTime: "--"}</td>
                                        <td 
                                        width="395"
                                        style={{
                                            color:(resumeModifyList[index] &&
                                            resumeModifyList[index].school?"red":"")
                                        }}
                                        title={(resumeModifyList[index] &&
                                        resumeModifyList[index].school? 
                                        `原：${resumeModifyList[index].school}\n改：${item.school}`: item.school)}
                                        >{item.school? item.school: "--"}</td>
                                        <td 
                                        width="160"
                                        style={{
                                            color:(resumeModifyList[index] &&
                                            resumeModifyList[index].learningContent?"red":"")
                                        }}
                                        title={(resumeModifyList[index] &&
                                        resumeModifyList[index].learningContent? 
                                        `原：${resumeModifyList[index].learningContent}\n改：${item.learningContent}`: item.learningContent)}
                                        >{item.learningContent? item.learningContent: "--"}</td>
                                        <td 
                                        width="140"
                                        style={{
                                            color:(resumeModifyList[index] &&
                                            resumeModifyList[index].duty?"red":"")
                                        }}
                                        title={(resumeModifyList[index] &&
                                        resumeModifyList[index].duty? 
                                        `原：${resumeModifyList[index].duty}\n改：${item.duty}`: item.duty)}
                                        >{item.duty? item.duty: "--"}</td>
                                        <td 
                                        width="150"
                                        style={{
                                            color:(resumeModifyList[index] &&
                                            resumeModifyList[index].certifier?"red":"")
                                        }}
                                        title={(resumeModifyList[index] &&
                                        resumeModifyList[index].certifier? 
                                        `原：${resumeModifyList[index].certifier}\n改：${item.certifier}`: item.certifier)}
                                        >{item.certifier? item.certifier: "--"}</td>
                                    </tr>
                                )
                            })
                        }
                        
                    </table>
                    <table className="transport-info" border="1" borderColor="#b7e1e5">
                        <caption>上下学交通方式</caption>
                        <tr>
                            <td width="200">上下学距离(千米)</td>
                            <td width="178" data-value="上下学距离（千米）">{currentStatus.extraInfoJson && currentStatus.extraInfoJson["上下学距离（千米）"]?
                            currentStatus.extraInfoJson["上下学距离（千米）"]: "--"}</td>
                            <td width="200">上下学交通方式</td>
                            <td width="178" data-value="上下学交通方式">{currentStatus.extraInfoJson && currentStatus.extraInfoJson["上下学交通方式"]?
                            currentStatus.extraInfoJson["上下学交通方式"]: "--"}</td>
                            <td width="200">是否需要乘坐校车</td>
                            <td width="178" data-value="是否需要乘坐校车">{currentStatus.extraInfoJson && currentStatus.extraInfoJson["是否需要乘坐校车"]?
                            currentStatus.extraInfoJson["是否需要乘坐校车"]: "--"}</td>
                        </tr>
                    </table>
                    {
                        Array.isArray(currentStatus.guardianJson) &&
                        currentStatus.guardianJson.map((item, index)=>{
                            return (
                                <table className="family-info" border="1" borderColor="#b7e1e5">
                                    {
                                        index == 0?
                                        <caption>家庭成员或监护人信息</caption>:
                                        ""
                                    }
                                    <tr>
                                        <td>姓名</td>
                                        <td 
                                        style={{
                                            color:(familyModifyList[index] &&
                                            familyModifyList[index].name?"red":"")
                                        }}
                                        title={(familyModifyList[index] &&
                                        familyModifyList[index].name? 
                                        `原：${familyModifyList[index].name}\n改：${item.name}`: item.name)}
                                        >{item.name? item.name: "--"}</td>
                                        <td>关系</td>
                                        <td
                                        style={{
                                            color:(familyModifyList[index] &&
                                            familyModifyList[index].relationship?"red":"")
                                        }}
                                        title={(familyModifyList[index] &&
                                        familyModifyList[index].relationship? 
                                        `原：${familyModifyList[index].relationship}\n改：${item.relationship}`: item.relationship)}
                                        >{item.relationship? item.relationship: "--"}</td>
                                        <td>身份证件类型</td>
                                        <td
                                        style={{
                                            color:(familyModifyList[index] &&
                                            familyModifyList[index].idCardType?"red":"")
                                        }}
                                        title={(familyModifyList[index] &&
                                        familyModifyList[index].idCardType? 
                                        `原：${familyModifyList[index].idCardType}\n改：${item.idCardType}`: item.idCardType)}
                                        >{item.idCardType? item.idCardType: "--"}</td>
                                        <td>身份证件号码</td>
                                        <td
                                        style={{
                                            color:(familyModifyList[index] &&
                                            familyModifyList[index].idCardNum?"red":"")
                                        }}
                                        title={(familyModifyList[index] &&
                                        familyModifyList[index].idCardNum? 
                                        `原：${familyModifyList[index].idCardNum}\n改：${item.idCardNum}`: item.idCardNum)}
                                        >{item.idCardNum? item.idCardNum: "--"}</td> 
                                    </tr>
                                    <tr>
                                        <td>民族</td>
                                        <td
                                        style={{
                                            color:(familyModifyList[index] &&
                                            familyModifyList[index].nation?"red":"")
                                        }}
                                        title={(familyModifyList[index] &&
                                        familyModifyList[index].nation? 
                                        `原：${familyModifyList[index].nation}\n改：${item.nation}`: item.nation)}
                                        >{item.nation? item.nation: "--"}</td>
                                        <td>是否监护人</td>
                                        <td
                                        style={{
                                            color:(familyModifyList[index] &&
                                            familyModifyList[index].isGuardian?"red":"")
                                        }}
                                        title={(familyModifyList[index] &&
                                        familyModifyList[index].isGuardian? 
                                        `原：${familyModifyList[index].isGuardian}\n改：${item.isGuardian}`: item.isGuardian)}
                                        >{item.isGuardian? item.isGuardian: "--"}</td>
                                        <td>户口所在地</td>
                                        <td
                                        style={{
                                            color:(familyModifyList[index] &&
                                            familyModifyList[index].censusPlace?"red":"")
                                        }}
                                        title={(familyModifyList[index] &&
                                        familyModifyList[index].censusPlace? 
                                        `原：${familyModifyList[index].censusPlace}\n改：${item.censusPlace}`: item.censusPlace)}
                                        >{item.censusPlace? item.censusPlace: "--"}</td>
                                        <td>联系方式</td>
                                        <td
                                        style={{
                                            color:(familyModifyList[index] &&
                                            familyModifyList[index].tel?"red":"")
                                        }}
                                        title={(familyModifyList[index] &&
                                        familyModifyList[index].tel? 
                                        `原：${familyModifyList[index].tel}\n改：${item.tel}`: item.tel)}
                                        >{item.tel? item.tel: "--"}</td> 
                                    </tr>
                                    <tr>
                                        <td>现住址</td>
                                        <td colSpan="3"
                                        style={{
                                            color:(familyModifyList[index] &&
                                            familyModifyList[index].address?"red":"")
                                        }}
                                        title={(familyModifyList[index] &&
                                        familyModifyList[index].address? 
                                        `原：${familyModifyList[index].address}\n改：${item.address}`: item.address)}
                                        >{item.address? item.address: "--"}</td>
                                        <td>工作单位</td>
                                        <td
                                        style={{
                                            color:(familyModifyList[index] &&
                                            familyModifyList[index].serviceUnit?"red":"")
                                        }}
                                        title={(familyModifyList[index] &&
                                        familyModifyList[index].serviceUnit? 
                                        `原：${familyModifyList[index].serviceUnit}\n改：${item.serviceUnit}`: item.serviceUnit)}
                                        >{item.serviceUnit? item.serviceUnit: "--"}</td>
                                        <td>职务</td>
                                        <td
                                        style={{
                                            color:(familyModifyList[index] &&
                                            familyModifyList[index].position?"red":"")
                                        }}
                                        title={(familyModifyList[index] &&
                                        familyModifyList[index].position? 
                                        `原：${familyModifyList[index].position}\n改：${item.position}`: item.position)}
                                        >{item.position? item.position: "--"}</td>
                                    </tr>
                                    {/* <tr>
                                        <td colSpan="8" style={{height: 7}}></td>
                                    </tr> */}
                                </table>
                            )
                        })
                    }
                    <table className="economic-info" border="1" borderColor="#b7e1e5">
                        <caption>家庭经济情况</caption>
                        <tr>
                            <td>家庭人口</td>
                            <td data-value="家庭人口">{currentStatus.extraInfoJson && currentStatus.extraInfoJson["家庭人口"]?
                            currentStatus.extraInfoJson["家庭人口"]: "--"}</td>
                            <td>赡养人口</td>
                            <td data-value="赡养人口">{currentStatus.extraInfoJson && currentStatus.extraInfoJson["赡养人口"]?
                            currentStatus.extraInfoJson["赡养人口"]: "--"}</td>
                            <td>家庭年收入</td>
                            <td data-value="家庭年收入">{currentStatus.extraInfoJson && currentStatus.extraInfoJson["家庭年收入"]?
                            currentStatus.extraInfoJson["家庭年收入"]: "--"}</td>
                            <td>主要收入来源</td>
                            <td data-value="主要收入来源">{currentStatus.extraInfoJson && currentStatus.extraInfoJson["主要收入来源"]?
                            currentStatus.extraInfoJson["主要收入来源"]: "--"}</td>
                        </tr>
                        <tr>
                            <td>具备劳动力人数</td>
                            <td data-value="具备劳动力人数">{currentStatus.extraInfoJson && currentStatus.extraInfoJson["具备劳动力人数"]?
                            currentStatus.extraInfoJson["具备劳动力人数"]: "--"}</td>
                            <td>是否低保</td>
                            <td data-value="是否低保">{currentStatus.extraInfoJson && currentStatus.extraInfoJson["是否低保"]?
                            currentStatus.extraInfoJson["是否低保"]: "--"}</td>
                            <td>就学地低保线</td>
                            <td data-value="就学地低保线">{currentStatus.extraInfoJson && currentStatus.extraInfoJson["就学地低保线"]?
                            currentStatus.extraInfoJson["就学地低保线"]: "--"}</td>
                            <td>困难程度</td>
                            <td data-value="困难程度">{currentStatus.extraInfoJson && currentStatus.extraInfoJson["困难程度"]?
                            currentStatus.extraInfoJson["困难程度"]: "--"}</td> 
                        </tr>
                        <tr>
                            <td>是否父母丧失劳动能力</td>
                            <td data-value="是否父母丧失劳动能力">{currentStatus.extraInfoJson && currentStatus.extraInfoJson["是否父母丧失劳动能力"]?
                            currentStatus.extraInfoJson["是否父母丧失劳动能力"]: "--"}</td>
                            <td>是否农村绝对贫困家庭</td>
                            <td data-value="是否农村绝对贫困家庭">{currentStatus.extraInfoJson && currentStatus.extraInfoJson["是否农村绝对贫困家庭"]?
                            currentStatus.extraInfoJson["是否农村绝对贫困家庭"]: "--"}</td>
                            <td colSpan="3">是否经民政部门确认的农村特困救助范围的家庭子女</td>
                            <td data-value="是否经民政部门确认的农村特困救助范围的家庭子女">{currentStatus.extraInfoJson && currentStatus.extraInfoJson["是否经民政部门确认的农村特困救助范围的家庭子女"]?
                            currentStatus.extraInfoJson["是否经民政部门确认的农村特困救助范围的家庭子女"]: "--"}</td>
                        </tr>
                        <tr>
                            <td>是否军烈属</td>
                            <td data-value="是否军烈属">{currentStatus.extraInfoJson && currentStatus.extraInfoJson["是否军烈属"]?
                            currentStatus.extraInfoJson["是否军烈属"]: "--"}</td>
                            <td>家庭是否五保户</td>
                            <td data-value="家庭是否五保户">{currentStatus.extraInfoJson && currentStatus.extraInfoJson["家庭是否五保户"]?
                            currentStatus.extraInfoJson["家庭是否五保户"]: "--"}</td>
                            <td colSpan="3">家中是否有大病患者</td>
                            <td data-value="家中是否有大病患者">{currentStatus.extraInfoJson && currentStatus.extraInfoJson["家中是否有大病患者"]?
                            currentStatus.extraInfoJson["家中是否有大病患者"]: "--"}</td>
                        </tr>
                        <tr>
                            <td>家庭是否遭受自然灾害</td>
                            <td data-value="家庭是否遭受自然灾害">{currentStatus.extraInfoJson && currentStatus.extraInfoJson["家庭是否遭受自然灾害"]?
                            currentStatus.extraInfoJson["家庭是否遭受自然灾害"]: "--"}</td>
                            <td colSpan="2">自然灾害具体情况描述</td>
                            <td colSpan="4" data-value="自然灾害具体情况描述">{currentStatus.extraInfoJson && currentStatus.extraInfoJson["自然灾害具体情况描述"]?
                            currentStatus.extraInfoJson["自然灾害具体情况描述"]: "--"}</td>
                        </tr>
                        <tr>
                            <td>家庭失业人数</td>
                            <td data-value="家庭失业人数">{currentStatus.extraInfoJson && currentStatus.extraInfoJson["家庭失业人数"]?
                            currentStatus.extraInfoJson["家庭失业人数"]: "--"}</td>
                            <td>家庭欠债金额</td>
                            <td data-value="家庭欠债金额">{currentStatus.extraInfoJson && currentStatus.extraInfoJson["家庭欠债金额"]?
                            currentStatus.extraInfoJson["家庭欠债金额"]: "--"}</td>
                            <td>欠债原因</td>
                            <td colSpan="3" data-value="欠债原因">{currentStatus.extraInfoJson && currentStatus.extraInfoJson["欠债原因"]?
                            currentStatus.extraInfoJson["欠债原因"]: "--"}</td>
                        </tr>
                    </table>
                </div> 
            </div>
            <p className="ProVersion" style={{marginBottom: 0}}>{ProVersion}</p>
        </div>  
    );
}
  
const mapStateToProps = (state) => {
    let {
      commonData: { roleMsg, basePlatFormMsg, contentHW, termInfo, levelHash, userInfo },
    } = state;
    return { roleMsg, basePlatFormMsg, contentHW, termInfo, levelHash, userInfo };
  };
export default connect(mapStateToProps)(memo(forwardRef(ErrorCheck)));
  