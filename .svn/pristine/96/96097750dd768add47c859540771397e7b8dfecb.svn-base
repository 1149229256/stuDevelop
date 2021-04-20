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
import "./index.scss";
import { Empty } from "../../component/common";
import { Upload, Pagination, ConfigProvider, message } from "antd";
import zhCN from "antd/es/locale/zh_CN";
import fetch from "../../util/fetch";
import ipConfig from "../../util/ipConfig";
let { BasicProxy } = ipConfig;

function ImportPage(props, ref) {
    let {
        setShowType,
        basePlatFormMsg: { ProVersion },
        ModuleID,
        currentClass,
        currentGrade,
        userInfo: {SchoolID},
        ModuleType
    } = props;
    //当前步骤进度  import导入文件；preview预览；save保存
    const [currentStep, setCurrentStep] = useState("import");

    //存储导入的学籍数据
    const [statusList, setStatusList] = useState([]);
    //当前展示的学籍数据
    const [currentStatus, setCurrentStatus] = useState({});
    //分页器当前页数
    const [currentIndex, setCurrentIndex] = useState(1);
    const [currentIndex2, setCurrentIndex2] = useState(1);
    //文件名
    const [fileName, setFileNameStep] = useState("");
    //步骤是否完成的标志
    const [importSign, setImportSign] = useState(0);
    const [previewSign, setPreviewSign] = useState(0);
    const [saveSign, setSaveSign] = useState(0);
    //下载的模板类别
    const download = () => {
        let url = BasicProxy + "/api/base/template?schoolId=" + SchoolID +
        "&gradeId=" + currentGrade +
        "&classId=" + currentClass +
        "&templateType=STATUS_LOGS" +
        "&blankSheet=0";
        //导出excel文档
        window.location.href = url;
    }
    const importFile = (data) => {
        let formData = new FormData();
        formData.append("multipartFile", data.file);
        let url = BasicProxy + "/api/status/import";
        $.ajax({
            url: url,
            type: 'post',
            async: true,
            data: formData,
            dataType:'json',
            cache: false, // 上传文件无需缓存
            processData : false, // 使数据不做处理
            contentType: false,
            headers: {
              "Authorization": "X-Token=" + sessionStorage.getItem("token"),
            },
            success: function(data){
              if(data.status == 200 && Array.isArray(data.data)){
                message.success("导入成功~");
                setStatusList(data.data);
                setCurrentStatus(data.data[0]);
                setImportSign(1);
              } else {
                if(data.msg && data.msg.indexOf(".xls") != -1){
                  message.error("文档内数据错误，请下载文件并修改标红行的数据！", 3);
                  window.location.href = BasicProxy + "/api/base/fileDownload?filePath=" + data.msg;
                  return;
                }
                message.error("导入失败！请在当前界面下载正确的模板文件~");
              }
              
               
            },
            error:function(response){
                message.error("导入失败！请在当前界面下载正确的模板文件~");
            }
        })
    }
    //判断当前步骤进度
    useEffect(() => {
        if(importSign == 0){
            setCurrentStep("import");
        }
        if(importSign == 1 && saveSign == 0){
            setCurrentStep("preview");
        }
        if(importSign == 1 && previewSign == 1){
            setCurrentStep("save");
        }
        if(importSign == 1 && previewSign == 1 && saveSign == 1){
            statusList.forEach((item)=>{
                item.extraInfo = JSON.stringify(item.extraInfoJson);
                item.guardianList = [];
                item.classId = item.classId? item.classId: "";
                item.gradeId = item.gradeId? item.gradeId: "";
                item.schoolId = item.schoolId? item.schoolId: "";
                item.isPoor = item.isPoor? item.isPoor: "";
                item.photoPath = item.photoPath? item.photoPath: "";
                item.errorCorrection = item.errorCorrection? item.errorCorrection: "";
                //传给后台的数据需要转换成字段
                item.guardianJson.forEach((child)=>{
                    let obj = {
                        name: child["姓名"],
                        relationship: child["关系"],
                        serviceUnit: child["工作单位"],
                        tel: child["联系方式"],
                        userId: item.studentName,
                        changeItem: 1,
                        id: 0,
                        address: child["现住址"],
                        censusPlace: child["户口所在地"],
                        idCardNum: child["身份证件号码"],
                        idCardType: child["身份证件类型"],
                        isGuardian: child["是否监护人"],
                        nation: child["民族"],
                        position: child["职务"]
                    }
                    item.guardianList.push(obj);
                })
                item.resumeList = [];
                //传给后台的数据需要转换成字段
                item.resumeJson.forEach((child)=>{
                    let obj = {
                        learningContent: child["学习内容"],
                        school: child["学习单位"],
                        semesterStartTime: child["学习结束时间"],
                        certifier: child["学习证明人"],
                        semesterEndTime: child["学习起始时间"],
                        duty: child["担任职务"],
                        userId: item.studentName,
                        changeItem: 1,
                        id: 0
                    }
                    item.resumeList.push(obj);
                })
            })
            // console.log(statusList)
            let url = BasicProxy + "/api/status/student";
            fetch
            .post({
                url, 
                securityLevel: 2, 
                body: statusList,
                header: {
                    "Content-Type": "application/json"
                }
            })
            .then((res)=>res.json())
            .then((result)=>{
                if(result.status == 200){
                    message.success("导入成功~");
                    setShowType("detail");
                } else {
                    message.error("导入失败！");
                }
            })
            // $.ajax({
            //     url: url,
            //     type: 'post',
            //     data: statusList,
            //     // dataType: 'json',
            //     headers: {
            //         "Authorization": "X-Token=" + sessionStorage.getItem("token"),
            //     },
            //     success: function(result){
            //         if(result.status == 200){
            //             message.success("导入成功~");
            //             setShowType("detail");
            //         } else {
            //             message.error("导入失败！");
            //         }
            //     }
            // })
                
        }
    }, [importSign, previewSign, saveSign])

    //删除某一条学籍信息
    const deleteStatusOne = () => {
        let arr = statusList.splice(currentIndex, 1);
        if(arr.length == 0){
            message.warn("当前暂无导入数据，请重新导入数据~", 3);
            setImportSign(0);
            return;
        }
        setStatusList(arr);
        setCurrentStatus(arr[currentIndex - 1]);
        
    }
    return (
        <div className="import-page">
            <div className="import-top">
                导入学籍信息
                <div className="goback" onClick={()=>setShowType("detail")}>返回详情界面</div>
            </div>
            <div className="import-step-list">
                <div 
                className={"step-1 " +
                (currentStep == "import"? "active": "prev")} 
                // onClick={()=>setCurrentStep("import")}
                >
                    1.导入文件
                </div>
                <div 
                className={"step-2 " + 
                (currentStep == "preview"? "active": currentStep == "save"? "prev": "")}
                // onClick={()=>setCurrentStep("preview")}
                >
                    2.内容预览
                </div>
                <div 
                className={"step-3 " +
                (currentStep == "save"? "active": "")} 
                // onClick={()=>setCurrentStep("save")}
                >
                    3.保存
                </div>
            </div>
            {
                currentStep == "import"?
                <div className="import-file">
                    <p className="import-tip">
                        <i className="warnlogo"></i>
                        导入提醒:
                    </p>
                    <p>1.选择导入的文件必须为模板文件。&nbsp;&nbsp;
                        "
                        <span className="template-download" onClick={download}>模板下载</span>
                        "
                    </p>
                    <p>2.模板文件内可以同时有多个学籍信息。</p>
                    <div className="file-upload">
                        {fileName}
                        <Upload
                        customRequest={importFile}
                        showUploadList={false}
                        >
                            <div className="file-upload-btn">选择文件</div>
                        </Upload>
                    </div>
                </div>:
                currentStep == "preview"?
                <div className="preview-file">
                    <div className="preview-top">
                        <ConfigProvider locale={zhCN}>
                            <Pagination
                            className="preview-pagination"
                            size="small"
                            total={statusList.length}
                            current={currentIndex}
                            pageSize={1}
                            showQuickJumper={true}
                            showSizeChanger={false}
                            hideOnSinglePage
                            onChange={(pageIndex)=>{
                                setCurrentStatus(statusList[pageIndex - 1]);
                                setCurrentIndex(pageIndex)
                            }}
                            />
                        </ConfigProvider>
                        <div className="btn-group">
                            {
                                statusList.length > 0?
                                <div className="delete-btn" onClick={deleteStatusOne}>删除</div>:
                                ""
                            }
                            <div className="next-btn" onClick={()=>{
                                setPreviewSign(1)
                                setCurrentStep("save")
                            }}>下一步</div>
                        </div>
                    </div>
                    {
                        currentStatus?
                       <div className="stu-status" style={{padding: 0}}>
                       <table className="base-info" border="1" borderColor="#b7e1e5">
                           <caption>基本信息及辅助信息</caption>
                           <tr>
                                <td>姓名</td>
                                <td title={currentStatus.studentName? currentStatus.studentName: "--"}>
                                    {currentStatus.studentName? currentStatus.studentName: "--"}
                                </td>
                                <td>性别</td>
                                <td title={currentStatus.gender? currentStatus.gender: "--"}>
                                    {currentStatus.gender? currentStatus.gender: "--"}
                                </td>
                                <td>出生日期</td>
                                <td title={currentStatus.dateOfBirth? currentStatus.dateOfBirth: "--"}>
                                    {currentStatus.dateOfBirth? currentStatus.dateOfBirth: "--"}
                                </td>
                                <td>出生地</td>
                                <td title={currentStatus.extraInfoJson && currentStatus.extraInfoJson["出生地"]?
                                currentStatus.extraInfoJson["出生地"]: "--"}>
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
                                <td title={currentStatus.nativePlace? currentStatus.nativePlace: "--"}>
                                    {currentStatus.nativePlace? currentStatus.nativePlace: "--"}
                                </td>
                                <td>民族</td>
                                <td title={currentStatus.nation? currentStatus.nation: "--"}>
                                    {currentStatus.nation? currentStatus.nation: "--"}
                                </td>
                                <td>国籍/地区</td>
                                <td title={currentStatus.nationality? currentStatus.nationality: "--"}>
                                    {currentStatus.nationality? currentStatus.nationality: "--"}
                                </td>
                                <td>身份证件类型</td>
                                <td title={currentStatus.extraInfoJson && currentStatus.extraInfoJson["身份证件类型"]?
                                currentStatus.extraInfoJson["身份证件类型"]: "--"}>
                                    {currentStatus.extraInfoJson && currentStatus.extraInfoJson["身份证件类型"]?
                                    currentStatus.extraInfoJson["身份证件类型"]: "--"}
                                </td> 
                            </tr>
                            <tr>
                                <td>身份证件号码</td>
                                <td colSpan="3" title={currentStatus.identityNum? currentStatus.identityNum: "--"}>
                                    {currentStatus.identityNum? currentStatus.identityNum: "--"}
                                </td>
                                <td>港澳台侨胞</td>
                                <td title={currentStatus.overseaPeople? currentStatus.overseaPeople: "--"}>
                                    {currentStatus.overseaPeople? currentStatus.overseaPeople: "--"}
                                </td>
                                <td>政治面貌</td>
                                <td title={currentStatus.extraInfoJson && currentStatus.extraInfoJson["政治面貌"]?
                                currentStatus.extraInfoJson["政治面貌"]: "--"}>
                                    {currentStatus.extraInfoJson && currentStatus.extraInfoJson["政治面貌"]?
                                    currentStatus.extraInfoJson["政治面貌"]: "--"}
                                </td>
                            </tr>
                            <tr>
                                <td>健康状况</td>
                                <td title={currentStatus.extraInfoJson && currentStatus.extraInfoJson["健康状况"]?
                                currentStatus.extraInfoJson["健康状况"]: "--"}>
                                    {currentStatus.extraInfoJson && currentStatus.extraInfoJson["健康状况"]?
                                    currentStatus.extraInfoJson["健康状况"]: "--"}
                                </td>
                                <td>姓名拼音</td>
                                <td title={currentStatus.extraInfoJson && currentStatus.extraInfoJson["姓名拼音"]?
                                currentStatus.extraInfoJson["姓名拼音"]: "--"}>
                                    {currentStatus.extraInfoJson && currentStatus.extraInfoJson["姓名拼音"]?
                                    currentStatus.extraInfoJson["姓名拼音"]: "--"}
                                </td>
                                <td>曾用名</td>
                                <td title={currentStatus.formerName? currentStatus.formerName: "--"}>
                                    {currentStatus.formerName? currentStatus.formerName: "--"}
                                </td>
                                <td>身份证件有效期</td>
                                <td title={currentStatus.extraInfoJson && currentStatus.extraInfoJson["身份证件有效期"]?
                                currentStatus.extraInfoJson["身份证件有效期"]: "--"}>
                                    {currentStatus.extraInfoJson && currentStatus.extraInfoJson["身份证件有效期"]?
                                    currentStatus.extraInfoJson["身份证件有效期"]: "--"}
                                </td> 
                            </tr>
                            <tr>
                                <td>户口所在地</td>
                                <td title={currentStatus.censusPlace? currentStatus.censusPlace: "--"}>
                                    {currentStatus.censusPlace? currentStatus.censusPlace: "--"}
                                </td>
                                <td>特长</td>
                                <td colSpan="5" title={currentStatus.extraInfoJson && currentStatus.extraInfoJson["特长"]?
                                currentStatus.extraInfoJson["特长"]: "--"}>
                                    {currentStatus.extraInfoJson && currentStatus.extraInfoJson["特长"]?
                                    currentStatus.extraInfoJson["特长"]: "--"}
                                </td>
                            </tr>
                            <tr>
                                <td>学籍辅号</td>
                                <td title={currentStatus.studentId? currentStatus.studentId: "--"}>
                                    {currentStatus.studentId? currentStatus.studentId: "--"}
                                </td>
                                <td>班内学号</td>
                                <td title={currentStatus.extraInfoJson && currentStatus.extraInfoJson["班内学号"]?
                                currentStatus.extraInfoJson["班内学号"]: "--"}>
                                    {currentStatus.extraInfoJson && currentStatus.extraInfoJson["班内学号"]?
                                    currentStatus.extraInfoJson["班内学号"]: "--"}
                                </td>
                                <td>年级</td>
                                <td title={currentStatus.gradeName? currentStatus.gradeName: "--"}>
                                    {currentStatus.gradeName? currentStatus.gradeName: "--"}
                                </td>
                                <td>班级</td>
                                <td title={currentStatus.className? currentStatus.className: "--"}>
                                    {currentStatus.className? currentStatus.className: "--"}
                                </td> 
                            </tr>
                            <tr>
                                <td>入学年月</td>
                                <td title={currentStatus.extraInfoJson && currentStatus.extraInfoJson["入学年月"]?
                                currentStatus.extraInfoJson["入学年月"]: "--"}>
                                    {currentStatus.extraInfoJson && currentStatus.extraInfoJson["入学年月"]?
                                    currentStatus.extraInfoJson["入学年月"]: "--"}
                                </td>
                                <td>入学方式</td>
                                <td title={currentStatus.extraInfoJson && currentStatus.extraInfoJson["入学方式"]?
                                currentStatus.extraInfoJson["入学方式"]: "--"}>
                                    {currentStatus.extraInfoJson && currentStatus.extraInfoJson["入学方式"]?
                                    currentStatus.extraInfoJson["入学方式"]: "--"}
                                </td>
                                <td>就读方式</td>
                                <td title={currentStatus.studyingWay?
                                currentStatus.studyingWay: "--"}>
                                    {currentStatus.studyingWay?
                                    currentStatus.studyingWay: "--"}
                                </td>
                                <td>学生来源</td>
                                <td colSpan="2" title={currentStatus.extraInfoJson && currentStatus.extraInfoJson["学生来源"]?
                                currentStatus.extraInfoJson["学生来源"]: "--"}>
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
                                currentStatus.extraInfoJson["现住址"]: "--"}>
                                    {currentStatus.extraInfoJson && currentStatus.extraInfoJson["现住址"]?
                                    currentStatus.extraInfoJson["现住址"]: "--"}
                                </td>
                                <td>通信地址</td>
                                <td colSpan="3" title={currentStatus.extraInfoJson && currentStatus.extraInfoJson["通讯地址"]?
                                currentStatus.extraInfoJson["通讯地址"]: "--"}>
                                    {currentStatus.extraInfoJson && currentStatus.extraInfoJson["通讯地址"]?
                                    currentStatus.extraInfoJson["通讯地址"]: "--"}
                                </td>
                            </tr>
                            <tr>
                                <td>家庭地址</td>
                                <td colSpan="3" title={currentStatus.homeAddress? currentStatus.homeAddress: "--"}>
                                    {currentStatus.homeAddress? currentStatus.homeAddress: "--"}
                                </td>
                                <td>联系电话</td>
                                <td title={currentStatus.extraInfoJson && currentStatus.extraInfoJson["联系电话"]?
                                currentStatus.extraInfoJson["联系电话"]: "--"}>
                                    {currentStatus.extraInfoJson && currentStatus.extraInfoJson["联系电话"]?
                                    currentStatus.extraInfoJson["联系电话"]: "--"}
                                </td>
                                <td>邮政编码</td>
                                <td title={currentStatus.extraInfoJson && currentStatus.extraInfoJson["邮政编号"]?
                                currentStatus.extraInfoJson["邮政编号"]: "--"}>
                                    {currentStatus.extraInfoJson && currentStatus.extraInfoJson["邮政编号"]?
                                    currentStatus.extraInfoJson["邮政编号"]: "--"}
                                </td>
                            </tr>
                            <tr>
                                <td>电子邮箱</td>
                                <td colSpan="3" title={currentStatus.extraInfoJson && currentStatus.extraInfoJson["电子邮箱"]?
                                currentStatus.extraInfoJson["电子邮箱"]: "--"}>
                                    {currentStatus.extraInfoJson && currentStatus.extraInfoJson["电子邮箱"]?
                                    currentStatus.extraInfoJson["电子邮箱"]: "--"}
                                </td>
                                <td>主页地址</td>
                                <td colSpan="3" title={currentStatus.extraInfoJson && currentStatus.extraInfoJson["主页地址"]?
                                currentStatus.extraInfoJson["主页地址"]: "--"}>
                                    {currentStatus.extraInfoJson && currentStatus.extraInfoJson["主页地址"]?
                                    currentStatus.extraInfoJson["主页地址"]: "--"}
                                </td>
                            </tr>
                        </table>
                       <table className="person-more-info" border="1" borderColor="#b7e1e5">
                           <caption>个人扩展信息</caption>
                           <tr>
                               <td width="200">是否独生子女</td>
                               <td width="85">{currentStatus.isOnlychild? currentStatus.isOnlychild: "--"}</td>
                               <td width="200">是否受过学前教育</td>
                               <td width="85">{currentStatus.isAcceptpreschool? currentStatus.isAcceptpreschool: "--"}</td>
                               <td width="200">是否留守儿童</td>
                               <td width="85">{currentStatus.isLeftbehindchild? currentStatus.isLeftbehindchild: "--"}</td>
                               <td width="200">是否进城务工人员随迁子女</td>
                               <td width="85">{currentStatus.extraInfoJson && currentStatus.extraInfoJson["是否进城务工人员随迁子女"]?
                                currentStatus.extraInfoJson["是否进城务工人员随迁子女"]: "--"}</td>
                           </tr>
                           <tr>
                               <td width="200">是否孤儿</td>
                               <td width="85">{currentStatus.extraInfoJson && currentStatus.extraInfoJson["是否孤儿"]?
                                currentStatus.extraInfoJson["是否孤儿"]: "--"}</td>
                               <td width="200">是否烈士或优抚子女</td>
                               <td width="85">{currentStatus.extraInfoJson && currentStatus.extraInfoJson["是否烈士或优抚子女"]?
                                currentStatus.extraInfoJson["是否烈士或优抚子女"]: "--"}</td>
                               <td width="200">随班就读</td>
                               <td width="85">{currentStatus.extraInfoJson && currentStatus.extraInfoJson["随班就读"]?
                                currentStatus.extraInfoJson["随班就读"]: "--"}</td>
                               <td width="200">是否需要申请资助</td>
                               <td width="85">{currentStatus.extraInfoJson && currentStatus.extraInfoJson["是否需要申请资助"]?
                                currentStatus.extraInfoJson["是否需要申请资助"]: "--"}</td>
                           </tr>
                           <tr>
                               <td width="200">是否享受一补</td>
                               <td width="85">{currentStatus.extraInfoJson && currentStatus.extraInfoJson["是否享受一补"]?
                                currentStatus.extraInfoJson["是否享受一补"]: "--"}</td>
                               <td width="200">残疾人类型</td>
                               <td colSpan="5">{currentStatus.extraInfoJson && currentStatus.extraInfoJson["残疾人类型"]?
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
                                   return (
                                       <tr key={index}>
                                           <td width="148">{item["学习起始时间"]? item["学习起始时间"]: "--"}</td>
                                           <td width="148">{item["学习结束时间"]? item["学习结束时间"]: "--"}</td>
                                           <td width="395">{item["学习单位"]? item["学习单位"]: "--"}</td>
                                           <td width="160">{item["学习内容"]? item["学习内容"]: "--"}</td>
                                           <td width="140">{item["担任职务"]? item["担任职务"]: "--"}</td>
                                           <td width="150">{item["学习证明人"]? item["学习证明人"]: "--"}</td>
                                       </tr>
                                   )
                               })
                           }
                           
                       </table>
                       <table className="transport-info" border="1" borderColor="#b7e1e5">
                           <caption>上下学交通方式</caption>
                           <tr>
                               <td width="200">上下学距离(千米)</td>
                               <td width="178">{currentStatus.extraInfoJson && currentStatus.extraInfoJson["上下学距离（千米）"]?
                                currentStatus.extraInfoJson["上下学距离（千米）"]: "--"}</td>
                               <td width="200">上下学交通方式</td>
                               <td width="178">{currentStatus.extraInfoJson && currentStatus.extraInfoJson["上下学交通方式"]?
                                currentStatus.extraInfoJson["上下学交通方式"]: "--"}</td>
                               <td width="200">是否需要乘坐校车</td>
                               <td width="178">{currentStatus.extraInfoJson && currentStatus.extraInfoJson["是否需要乘坐校车"]?
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
                                           <td>{item["姓名"]? item["姓名"]: "--"}</td>
                                           <td>关系</td>
                                           <td>{item["关系"]? item["关系"]: "--"}</td>
                                           <td>身份证件类型</td>
                                           <td>{item["身份证件类型"]? item["身份证件类型"]: "--"}</td>
                                           <td>身份证件号码</td>
                                           <td>{item["身份证件号码"]? item["身份证件号码"]: "--"}</td> 
                                       </tr>
                                       <tr>
                                           <td>民族</td>
                                           <td>{item["民族"]? item["民族"]: "--"}</td>
                                           <td>是否监护人</td>
                                           <td>{item["是否监护人"]? item["是否监护人"]: "--"}</td>
                                           <td>户口所在地</td>
                                           <td>{item["户口所在地"]? item["户口所在地"]: "--"}</td>
                                           <td>联系方式</td>
                                           <td>{item["联系方式"]? item["联系方式"]: "--"}</td> 
                                       </tr>
                                       <tr>
                                           <td>现住址</td>
                                           <td colSpan="3">{item["现住址"]? item["现住址"]: "--"}</td>
                                           <td>工作单位</td>
                                           <td>{item["工作单位"]? item["工作单位"]: "--"}</td>
                                           <td>职务</td>
                                           <td>{item["职务"]? item["职务"]: "--"}</td>
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
                               <td>{currentStatus.extraInfoJson && currentStatus.extraInfoJson["家庭人口"]?
                                currentStatus.extraInfoJson["家庭人口"]: "--"}</td>
                               <td>赡养人口</td>
                               <td>{currentStatus.extraInfoJson && currentStatus.extraInfoJson["赡养人口"]?
                                currentStatus.extraInfoJson["赡养人口"]: "--"}</td>
                               <td>家庭年收入</td>
                               <td>{currentStatus.extraInfoJson && currentStatus.extraInfoJson["家庭年收入"]?
                                currentStatus.extraInfoJson["家庭年收入"]: "--"}</td>
                               <td>主要收入来源</td>
                               <td>{currentStatus.extraInfoJson && currentStatus.extraInfoJson["主要收入来源"]?
                                currentStatus.extraInfoJson["主要收入来源"]: "--"}</td>
                           </tr>
                           <tr>
                               <td>具备劳动力人数</td>
                               <td>{currentStatus.extraInfoJson && currentStatus.extraInfoJson["具备劳动力人数"]?
                                currentStatus.extraInfoJson["具备劳动力人数"]: "--"}</td>
                               <td>是否低保</td>
                               <td>{currentStatus.extraInfoJson && currentStatus.extraInfoJson["是否低保"]?
                                currentStatus.extraInfoJson["是否低保"]: "--"}</td>
                               <td>就学地低保线</td>
                               <td>{currentStatus.extraInfoJson && currentStatus.extraInfoJson["就学地低保线"]?
                                currentStatus.extraInfoJson["就学地低保线"]: "--"}</td>
                               <td>困难程度</td>
                               <td>{currentStatus.extraInfoJson && currentStatus.extraInfoJson["困难程度"]?
                                currentStatus.extraInfoJson["困难程度"]: "--"}</td> 
                           </tr>
                           <tr>
                               <td>是否父母丧失劳动能力</td>
                               <td>{currentStatus.extraInfoJson && currentStatus.extraInfoJson["是否父母丧失劳动能力"]?
                                currentStatus.extraInfoJson["是否父母丧失劳动能力"]: "--"}</td>
                               <td>是否农村绝对贫困家庭</td>
                               <td>{currentStatus.extraInfoJson && currentStatus.extraInfoJson["是否农村绝对贫困家庭"]?
                                currentStatus.extraInfoJson["是否农村绝对贫困家庭"]: "--"}</td>
                               <td colSpan="3">是否经民政部门确认的农村特困救助范围的家庭子女</td>
                               <td>{currentStatus.extraInfoJson && currentStatus.extraInfoJson["是否经民政部门确认的农村特困救助范围的家庭子女"]?
                                currentStatus.extraInfoJson["是否经民政部门确认的农村特困救助范围的家庭子女"]: "--"}</td>
                           </tr>
                           <tr>
                               <td>是否军烈属</td>
                               <td>{currentStatus.extraInfoJson && currentStatus.extraInfoJson["是否军烈属"]?
                                currentStatus.extraInfoJson["是否军烈属"]: "--"}</td>
                               <td>家庭是否五保户</td>
                               <td>{currentStatus.extraInfoJson && currentStatus.extraInfoJson["家庭是否五保户"]?
                                currentStatus.extraInfoJson["家庭是否五保户"]: "--"}</td>
                               <td colSpan="3">家庭是否有大病患者</td>
                               <td>{currentStatus.extraInfoJson && currentStatus.extraInfoJson["家中是否有大病患者"]?
                                currentStatus.extraInfoJson["家中是否有大病患者"]: "--"}</td>
                           </tr>
                           <tr>
                               <td>家庭是否遭受自然灾害</td>
                               <td>{currentStatus.extraInfoJson && currentStatus.extraInfoJson["家庭是否遭受自然灾害"]?
                                currentStatus.extraInfoJson["家庭是否遭受自然灾害"]: "--"}</td>
                               <td colSpan="2">自然灾害具体情况描述</td>
                               <td colSpan="4">{currentStatus.extraInfoJson && currentStatus.extraInfoJson["自然灾害具体情况描述"]?
                                currentStatus.extraInfoJson["自然灾害具体情况描述"]: "--"}</td>
                           </tr>
                           <tr>
                               <td>家庭失业人数</td>
                               <td>{currentStatus.extraInfoJson && currentStatus.extraInfoJson["家庭失业人数"]?
                                currentStatus.extraInfoJson["家庭失业人数"]: "--"}</td>
                               <td>家庭欠债金额</td>
                               <td>{currentStatus.extraInfoJson && currentStatus.extraInfoJson["家庭欠债金额"]?
                                currentStatus.extraInfoJson["家庭欠债金额"]: "--"}</td>
                               <td>欠债原因</td>
                               <td colSpan="3">{currentStatus.extraInfoJson && currentStatus.extraInfoJson["欠债原因"]?
                                currentStatus.extraInfoJson["欠债原因"]: "--"}</td>
                           </tr>
                       </table>
                       
                     </div> 
                        :
                        <Empty
                        // className={"bar-empty"}
                        style={{margin: "20px 0"}}
                        title={"暂无数据"}
                        type={"4"}
                        ></Empty>
                    }
                </div>:
                currentStep == "save"?
                <div className="save-file">
                    <div className="preview-top">
                        <ConfigProvider locale={zhCN}>
                            <Pagination
                            className="preview-pagination"
                            size="small"
                            total={statusList.length}
                            current={currentIndex2}
                            pageSize={1}
                            showQuickJumper={true}
                            showSizeChanger={false}
                            hideOnSinglePage
                            onChange={(pageIndex)=>{
                                setCurrentStatus(statusList[pageIndex - 1]);
                                setCurrentIndex2(pageIndex)
                            }}
                        />
                        </ConfigProvider>
                        <div className="btn-group">
                            {/* <div className="edit-btn">编辑</div> */}
                            <div className="confirm-btn" onClick={()=>{
                                setImportSign(1);
                                setPreviewSign(1);
                                setSaveSign(1);
                            }}>确认</div>
                        </div>
                    </div>
                    {
                        currentStatus?
                       <div className="stu-status">
                       <table className="base-info" border="1" borderColor="#b7e1e5">
                           <caption>基本信息及辅助信息</caption>
                           <tr>
                               <td>姓名</td>
                               <td>{currentStatus.studentName? currentStatus.studentName: "--"}</td>
                               <td>性别</td>
                               <td>{currentStatus.gender? currentStatus.gender: "--"}</td>
                               <td>出生日期</td>
                               <td>{currentStatus.dateOfBirth? currentStatus.dateOfBirth: "--"}</td>
                               <td>出生地</td>
                               <td>{currentStatus.extraInfoJson && currentStatus.extraInfoJson["出生地"]?
                                currentStatus.extraInfoJson["出生地"]: "--"}</td> 
                           <td rowSpan="6" style={{
                               backgroundImage: `url(${currentStatus.photoPath})`,
                               backgroundSize: '100% 100%'
                               }}></td>
                           </tr>
                           <tr>
                               <td>籍贯</td>
                               <td>{currentStatus.nativePlace? currentStatus.nativePlace: "--"}</td>
                               <td>民族</td>
                               <td>{currentStatus.nation? currentStatus.nation: "--"}</td>
                               <td>国籍/地区</td>
                               <td>{currentStatus.nationality? currentStatus.nationality: "--"}</td>
                               <td>身份证件类型</td>
                               <td>{currentStatus.extraInfoJson && currentStatus.extraInfoJson["身份证件类型"]?
                                currentStatus.extraInfoJson["身份证件类型"]: "--"}</td> 
                           </tr>
                           <tr>
                               <td>身份证件号码</td>
                               <td colSpan="3">{currentStatus.identityNum? currentStatus.identityNum: "--"}</td>
                               <td>港澳台侨胞</td>
                               <td>{currentStatus.overseaPeople? currentStatus.overseaPeople: "--"}</td>
                               <td>政治面貌</td>
                               <td>{currentStatus.extraInfoJson && currentStatus.extraInfoJson["政治面貌"]?
                                currentStatus.extraInfoJson["政治面貌"]: "--"}</td>
                           </tr>
                           <tr>
                               <td>健康状况</td>
                               <td>{currentStatus.extraInfoJson && currentStatus.extraInfoJson["健康状况"]?
                                currentStatus.extraInfoJson["健康状况"]: "--"}</td>
                               <td>姓名拼音</td>
                               <td>{currentStatus.extraInfoJson && currentStatus.extraInfoJson["姓名拼音"]?
                                currentStatus.extraInfoJson["姓名拼音"]: "--"}</td>
                               <td>曾用名</td>
                               <td>{currentStatus.formerName? currentStatus.formerName: "--"}</td>
                               <td>身份证件有效期</td>
                               <td>{currentStatus.extraInfoJson && currentStatus.extraInfoJson["身份证件有效期"]?
                                currentStatus.extraInfoJson["身份证件有效期"]: "--"}</td> 
                           </tr>
                           <tr>
                               <td>户口所在地</td>
                               <td>{currentStatus.censusPlace? currentStatus.censusPlace: "--"}</td>
                               <td>特长</td>
                               <td colSpan="5">{currentStatus.extraInfoJson && currentStatus.extraInfoJson["特长"]?
                                currentStatus.extraInfoJson["特长"]: "--"}</td>
                           </tr>
                           <tr>
                               <td>学籍辅号</td>
                               <td>{currentStatus.extraInfoJson && currentStatus.extraInfoJson["学籍辅号"]?
                                currentStatus.extraInfoJson["学籍辅号"]: "--"}</td>
                               <td>班内学号</td>
                               <td>{currentStatus.studentId? currentStatus.studentId: "--"}</td>
                               <td>年级</td>
                               <td>{currentStatus.gradeName? currentStatus.gradeName: "--"}</td>
                               <td>班级</td>
                               <td>{currentStatus.className? currentStatus.className: "--"}</td> 
                           </tr>
                           <tr>
                               <td>入学年月</td>
                               <td>{currentStatus.extraInfoJson && currentStatus.extraInfoJson["入学年月"]?
                                currentStatus.extraInfoJson["入学年月"]: "--"}</td>
                               <td>入学方式</td>
                               <td>{currentStatus.extraInfoJson && currentStatus.extraInfoJson["入学方式"]?
                                currentStatus.extraInfoJson["入学方式"]: "--"}</td>
                               <td>就读方式</td>
                               <td>{currentStatus.studyingWay?
                                currentStatus.studyingWay: "--"}</td>
                               <td>学生来源</td>
                               <td colSpan="2">{currentStatus.extraInfoJson && currentStatus.extraInfoJson["学生来源"]?
                                currentStatus.extraInfoJson["学生来源"]: "--"}</td> 
                           </tr>
                       </table>
                       <table className="person-link" border="1" borderColor="#b7e1e5">
                           <caption>个人联系方式</caption>
                           <tr>
                               <td>现住址</td>
                               <td colSpan="3">{currentStatus.extraInfoJson && currentStatus.extraInfoJson["现住址"]?
                                currentStatus.extraInfoJson["现住址"]: "--"}</td>
                               <td>通信地址</td>
                               <td colSpan="3">{currentStatus.extraInfoJson && currentStatus.extraInfoJson["通讯地址"]?
                                currentStatus.extraInfoJson["通讯地址"]: "--"}</td>
                           </tr>
                           <tr>
                               <td>家庭地址</td>
                               <td colSpan="3">{currentStatus.homeAddress?
                                currentStatus.homeAddress: "--"}</td>
                               <td>联系电话</td>
                               <td>{currentStatus.extraInfoJson && currentStatus.extraInfoJson["联系电话"]?
                                currentStatus.extraInfoJson["联系电话"]: "--"}</td>
                               <td>邮政编码</td>
                               <td>{currentStatus.extraInfoJson && currentStatus.extraInfoJson["邮政编号"]?
                                currentStatus.extraInfoJson["邮政编号"]: "--"}</td>
                           </tr>
                           <tr>
                               <td>电子邮箱</td>
                               <td colSpan="3">{currentStatus.extraInfoJson && currentStatus.extraInfoJson["电子邮箱"]?
                                currentStatus.extraInfoJson["电子邮箱"]: "--"}</td>
                               <td>主页地址</td>
                               <td colSpan="3">{currentStatus.extraInfoJson && currentStatus.extraInfoJson["主页地址"]?
                                currentStatus.extraInfoJson["主页地址"]: "--"}</td>
                           </tr>
                       </table>
                       <table className="person-more-info" border="1" borderColor="#b7e1e5">
                           <caption>个人扩展信息</caption>
                           <tr>
                               <td width="200">是否独生子女</td>
                               <td width="85">{currentStatus.isOnlychild? currentStatus.isOnlychild: "--"}</td>
                               <td width="200">是否受过学前教育</td>
                               <td width="85">{currentStatus.isAcceptpreschool? currentStatus.isAcceptpreschool: "--"}</td>
                               <td width="200">是否留守儿童</td>
                               <td width="85">{currentStatus.isLeftbehindchild? currentStatus.isLeftbehindchild: "--"}</td>
                               <td width="200">是否进城务工人员随迁子女</td>
                               <td width="85">{currentStatus.extraInfoJson && currentStatus.extraInfoJson["是否进城务工人员随迁子女"]?
                                currentStatus.extraInfoJson["是否进城务工人员随迁子女"]: "--"}</td>
                           </tr>
                           <tr>
                               <td width="200">是否孤儿</td>
                               <td width="85">{currentStatus.extraInfoJson && currentStatus.extraInfoJson["是否孤儿"]?
                                currentStatus.extraInfoJson["是否孤儿"]: "--"}</td>
                               <td width="200">是否烈士或优抚子女</td>
                               <td width="85">{currentStatus.extraInfoJson && currentStatus.extraInfoJson["是否烈士或优抚子女"]?
                                currentStatus.extraInfoJson["是否烈士或优抚子女"]: "--"}</td>
                               <td width="200">随班就读</td>
                               <td width="85">{currentStatus.extraInfoJson && currentStatus.extraInfoJson["随班就读"]?
                                currentStatus.extraInfoJson["随班就读"]: "--"}</td>
                               <td width="200">是否需要申请资助</td>
                               <td width="85">{currentStatus.extraInfoJson && currentStatus.extraInfoJson["是否需要申请资助"]?
                                currentStatus.extraInfoJson["是否需要申请资助"]: "--"}</td>
                           </tr>
                           <tr>
                               <td width="200">是否享受一补</td>
                               <td width="85">{currentStatus.extraInfoJson && currentStatus.extraInfoJson["是否享受一补"]?
                                currentStatus.extraInfoJson["是否享受一补"]: "--"}</td>
                               <td width="200">残疾人类型</td>
                               <td colSpan="5">{currentStatus.extraInfoJson && currentStatus.extraInfoJson["残疾人类型"]?
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
                                   return (
                                    <tr key={index}>
                                        <td width="148">{item["学习起始时间"]? item["学习起始时间"]: "--"}</td>
                                        <td width="148">{item["学习结束时间"]? item["学习结束时间"]: "--"}</td>
                                        <td width="395">{item["学习单位"]? item["学习单位"]: "--"}</td>
                                        <td width="160">{item["学习内容"]? item["学习内容"]: "--"}</td>
                                        <td width="140">{item["担任职务"]? item["担任职务"]: "--"}</td>
                                        <td width="150">{item["学习证明人"]? item["学习证明人"]: "--"}</td>
                                    </tr>
                                   )
                               })
                           }
                           
                       </table>
                       <table className="transport-info" border="1" borderColor="#b7e1e5">
                           <caption>上下学交通方式</caption>
                           <tr>
                               <td width="200">上下学距离(千米)</td>
                               <td width="178">{currentStatus.extraInfoJson && currentStatus.extraInfoJson["上下学距离（千米）"]?
                                currentStatus.extraInfoJson["上下学距离（千米）"]: "--"}</td>
                               <td width="200">上下学交通方式</td>
                               <td width="178">{currentStatus.extraInfoJson && currentStatus.extraInfoJson["上下学交通方式"]?
                                currentStatus.extraInfoJson["上下学交通方式"]: "--"}</td>
                               <td width="200">是否需要乘坐校车</td>
                               <td width="178">{currentStatus.extraInfoJson && currentStatus.extraInfoJson["是否需要乘坐校车"]?
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
                                           <td>{item["姓名"]? item["姓名"]: "--"}</td>
                                           <td>关系</td>
                                           <td>{item["关系"]? item["关系"]: "--"}</td>
                                           <td>身份证件类型</td>
                                           <td>{item["身份证件类型"]? item["身份证件类型"]: "--"}</td>
                                           <td>身份证件号码</td>
                                           <td>{item["身份证件号码"]? item["身份证件号码"]: "--"}</td> 
                                       </tr>
                                       <tr>
                                           <td>民族</td>
                                           <td>{item["民族"]? item["民族"]: "--"}</td>
                                           <td>是否监护人</td>
                                           <td>{item["是否监护人"]? item["是否监护人"]: "--"}</td>
                                           <td>户口所在地</td>
                                           <td>{item["户口所在地"]? item["户口所在地"]: "--"}</td>
                                           <td>联系方式</td>
                                           <td>{item["联系方式"]? item["联系方式"]: "--"}</td> 
                                       </tr>
                                       <tr>
                                           <td>现住址</td>
                                           <td colSpan="3">{item["现住址"]? item["现住址"]: "--"}</td>
                                           <td>工作单位</td>
                                           <td>{item["工作单位"]? item["工作单位"]: "--"}</td>
                                           <td>职务</td>
                                           <td>{item["职务"]? item["职务"]: "--"}</td>
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
                               <td>{currentStatus.extraInfoJson && currentStatus.extraInfoJson["家庭人口"]?
                                currentStatus.extraInfoJson["家庭人口"]: "--"}</td>
                               <td>赡养人口</td>
                               <td>{currentStatus.extraInfoJson && currentStatus.extraInfoJson["赡养人口"]?
                                currentStatus.extraInfoJson["赡养人口"]: "--"}</td>
                               <td>家庭年收入</td>
                               <td>{currentStatus.extraInfoJson && currentStatus.extraInfoJson["家庭年收入"]?
                                currentStatus.extraInfoJson["家庭年收入"]: "--"}</td>
                               <td>主要收入来源</td>
                               <td>{currentStatus.extraInfoJson && currentStatus.extraInfoJson["主要收入来源"]?
                                currentStatus.extraInfoJson["主要收入来源"]: "--"}</td>
                           </tr>
                           <tr>
                               <td>具备劳动力人数</td>
                               <td>{currentStatus.extraInfoJson && currentStatus.extraInfoJson["具备劳动力人数"]?
                                currentStatus.extraInfoJson["具备劳动力人数"]: "--"}</td>
                               <td>是否低保</td>
                               <td>{currentStatus.extraInfoJson && currentStatus.extraInfoJson["是否低保"]?
                                currentStatus.extraInfoJson["是否低保"]: "--"}</td>
                               <td>就学地低保线</td>
                               <td>{currentStatus.extraInfoJson && currentStatus.extraInfoJson["就学地低保线"]?
                                currentStatus.extraInfoJson["就学地低保线"]: "--"}</td>
                               <td>困难程度</td>
                               <td>{currentStatus.extraInfoJson && currentStatus.extraInfoJson["困难程度"]?
                                currentStatus.extraInfoJson["困难程度"]: "--"}</td> 
                           </tr>
                           <tr>
                               <td>是否父母丧失劳动能力</td>
                               <td>{currentStatus.extraInfoJson && currentStatus.extraInfoJson["是否父母丧失劳动能力"]?
                                currentStatus.extraInfoJson["是否父母丧失劳动能力"]: "--"}</td>
                               <td>是否农村绝对贫困家庭</td>
                               <td>{currentStatus.extraInfoJson && currentStatus.extraInfoJson["是否农村绝对贫困家庭"]?
                                currentStatus.extraInfoJson["是否农村绝对贫困家庭"]: "--"}</td>
                               <td colSpan="3">是否经民政部门确认的农村特困救助范围的家庭子女</td>
                               <td>{currentStatus.extraInfoJson && currentStatus.extraInfoJson["是否经民政部门确认的农村特困救助范围的家庭子女"]?
                                currentStatus.extraInfoJson["是否经民政部门确认的农村特困救助范围的家庭子女"]: "--"}</td>
                           </tr>
                           <tr>
                               <td>是否军烈属</td>
                               <td>{currentStatus.extraInfoJson && currentStatus.extraInfoJson["是否军烈属"]?
                                currentStatus.extraInfoJson["是否军烈属"]: "--"}</td>
                               <td>家庭是否五保户</td>
                               <td>{currentStatus.extraInfoJson && currentStatus.extraInfoJson["家庭是否五保户"]?
                                currentStatus.extraInfoJson["家庭是否五保户"]: "--"}</td>
                               <td colSpan="3">家庭是否有大病患者</td>
                               <td>{currentStatus.extraInfoJson && currentStatus.extraInfoJson["家中是否有大病患者"]?
                                currentStatus.extraInfoJson["家中是否有大病患者"]: "--"}</td>
                           </tr>
                           <tr>
                               <td>家庭是否遭受自然灾害</td>
                               <td>{currentStatus.extraInfoJson && currentStatus.extraInfoJson["家庭是否遭受自然灾害"]?
                                currentStatus.extraInfoJson["家庭是否遭受自然灾害"]: "--"}</td>
                               <td colSpan="2">自然灾害具体情况描述</td>
                               <td colSpan="4">{currentStatus.extraInfoJson && currentStatus.extraInfoJson["自然灾害具体情况描述"]?
                                currentStatus.extraInfoJson["自然灾害具体情况描述"]: "--"}</td>
                           </tr>
                           <tr>
                               <td>家庭失业人数</td>
                               <td>{currentStatus.extraInfoJson && currentStatus.extraInfoJson["家庭失业人数"]?
                                currentStatus.extraInfoJson["家庭失业人数"]: "--"}</td>
                               <td>家庭欠债金额</td>
                               <td>{currentStatus.extraInfoJson && currentStatus.extraInfoJson["家庭欠债金额"]?
                                currentStatus.extraInfoJson["家庭欠债金额"]: "--"}</td>
                               <td>欠债原因</td>
                               <td colSpan="3">{currentStatus.extraInfoJson && currentStatus.extraInfoJson["欠债原因"]?
                                currentStatus.extraInfoJson["欠债原因"]: "--"}</td>
                           </tr>
                       </table>
                       
                     </div> 
                        :
                        <Empty
                        // className={"bar-empty"}
                        style={{margin: "20px 0"}}
                        title={"暂无数据"}
                        type={"4"}
                        ></Empty>
                    }
                </div>:
                ""
            }
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
export default connect(mapStateToProps)(memo(forwardRef(ImportPage)));
  