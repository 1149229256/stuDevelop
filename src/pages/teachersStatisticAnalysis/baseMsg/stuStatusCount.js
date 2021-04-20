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
import Item from "@/component/tableItem";
import echarts from "echarts/lib/echarts";
import "echarts/lib/chart/bar";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
import "echarts/lib/component/legend";
import "echarts/lib/component/markPoint";
import "echarts/lib/component/dataZoom";
import fetch from "../../../util/fetch";
import ipConfig from "../../../util/ipConfig";

let { BasicProxy } = ipConfig;
  function StucherCount(props, ref) {
    let {
        userInfo: { UserID },
        userStatus
    } = props;
    // const [userStatus, setUserStatus] = useState({});
    
    // userStatus.extraInfoJson = JSON.parse(userStatus.extraInfoJson);
    // console.log(userStatus.extraInfoJson);
    return (
      <div className="stu-status">
        <table className="base-info" border="1" borderColor="#b7e1e5">
            <caption>基本信息及辅助信息</caption>
            <tr>
                <td>姓名</td>
                <td title={userStatus.studentName? userStatus.studentName: "--"}>
                    {userStatus.studentName? userStatus.studentName: "--"}
                </td>
                <td>性别</td>
                <td title={userStatus.gender? userStatus.gender: "--"}>
                    {userStatus.gender? userStatus.gender: "--"}
                </td>
                <td>出生日期</td>
                <td title={userStatus.dateOfBirth? userStatus.dateOfBirth: "--"}>
                    {userStatus.dateOfBirth? userStatus.dateOfBirth: "--"}
                </td>
                <td>出生地</td>
                <td title={userStatus.extraInfoJson && userStatus.extraInfoJson["出生地"]?
                 userStatus.extraInfoJson["出生地"]: "--"}>
                    {userStatus.extraInfoJson && userStatus.extraInfoJson["出生地"]?
                    userStatus.extraInfoJson["出生地"]: "--"}
                </td> 
                <td rowSpan="6" style={{
                    backgroundImage: `url(${userStatus.photoPath})`,
                    backgroundSize: `calc(100% - 24px) calc(100% - 24px)`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center center'
                    }}>
                </td>
            </tr>
            <tr>
                <td>籍贯</td>
                <td title={userStatus.nativePlace? userStatus.nativePlace: "--"}>
                    {userStatus.nativePlace? userStatus.nativePlace: "--"}
                </td>
                <td>民族</td>
                <td title={userStatus.nation? userStatus.nation: "--"}>
                    {userStatus.nation? userStatus.nation: "--"}
                </td>
                <td>国籍/地区</td>
                <td title={userStatus.nationality? userStatus.nationality: "--"}>
                    {userStatus.nationality? userStatus.nationality: "--"}
                </td>
                <td>身份证件类型</td>
                <td title={userStatus.extraInfoJson && userStatus.extraInfoJson["身份证件类型"]?
                 userStatus.extraInfoJson["身份证件类型"]: "--"}>
                    {userStatus.extraInfoJson && userStatus.extraInfoJson["身份证件类型"]?
                    userStatus.extraInfoJson["身份证件类型"]: "--"}
                </td> 
            </tr>
            <tr>
                <td>身份证件号码</td>
                <td colSpan="3" title={userStatus.identityNum? userStatus.identityNum: "--"}>
                    {userStatus.identityNum? userStatus.identityNum: "--"}
                </td>
                <td>港澳台侨胞</td>
                <td title={userStatus.overseaPeople? userStatus.overseaPeople: "--"}>
                    {userStatus.overseaPeople? userStatus.overseaPeople: "--"}
                </td>
                <td>政治面貌</td>
                <td title={userStatus.extraInfoJson && userStatus.extraInfoJson["政治面貌"]?
                 userStatus.extraInfoJson["政治面貌"]: "--"}>
                    {userStatus.extraInfoJson && userStatus.extraInfoJson["政治面貌"]?
                    userStatus.extraInfoJson["政治面貌"]: "--"}
                </td>
            </tr>
            <tr>
                <td>健康状况</td>
                <td title={userStatus.extraInfoJson && userStatus.extraInfoJson["健康状况"]?
                 userStatus.extraInfoJson["健康状况"]: "--"}>
                    {userStatus.extraInfoJson && userStatus.extraInfoJson["健康状况"]?
                    userStatus.extraInfoJson["健康状况"]: "--"}
                </td>
                <td>姓名拼音</td>
                <td title={userStatus.extraInfoJson && userStatus.extraInfoJson["姓名拼音"]?
                 userStatus.extraInfoJson["姓名拼音"]: "--"}>
                    {userStatus.extraInfoJson && userStatus.extraInfoJson["姓名拼音"]?
                    userStatus.extraInfoJson["姓名拼音"]: "--"}
                </td>
                <td>曾用名</td>
                <td title={userStatus.formerName? userStatus.formerName: "--"}>
                    {userStatus.formerName? userStatus.formerName: "--"}
                </td>
                <td>身份证件有效期</td>
                <td title={userStatus.extraInfoJson && userStatus.extraInfoJson["身份证件有效期"]?
                 userStatus.extraInfoJson["身份证件有效期"]: "--"}>
                    {userStatus.extraInfoJson && userStatus.extraInfoJson["身份证件有效期"]?
                    userStatus.extraInfoJson["身份证件有效期"]: "--"}
                </td> 
            </tr>
            <tr>
                <td>户口所在地</td>
                <td title={userStatus.censusPlace? userStatus.censusPlace: "--"}>
                    {userStatus.censusPlace? userStatus.censusPlace: "--"}
                </td>
                <td>特长</td>
                <td colSpan="5" title={userStatus.extraInfoJson && userStatus.extraInfoJson["特长"]?
                 userStatus.extraInfoJson["特长"]: "--"}>
                    {userStatus.extraInfoJson && userStatus.extraInfoJson["特长"]?
                    userStatus.extraInfoJson["特长"]: "--"}
                </td>
            </tr>
            <tr>
                <td>学籍辅号</td>
                <td title={userStatus.studentId? userStatus.studentId: "--"}>
                    {userStatus.studentId? userStatus.studentId: "--"}
                </td>
                <td>班内学号</td>
                <td title={userStatus.extraInfoJson && userStatus.extraInfoJson["班内学号"]?
                 userStatus.extraInfoJson["班内学号"]: "--"}>
                    {userStatus.extraInfoJson && userStatus.extraInfoJson["班内学号"]?
                    userStatus.extraInfoJson["班内学号"]: "--"}
                </td>
                <td>年级</td>
                <td title={userStatus.gradeName? userStatus.gradeName: "--"}>
                    {userStatus.gradeName? userStatus.gradeName: "--"}
                </td>
                <td>班级</td>
                <td title={userStatus.className? userStatus.className: "--"}>
                    {userStatus.className? userStatus.className: "--"}
                </td> 
            </tr>
            <tr>
                <td>入学年月</td>
                <td title={userStatus.extraInfoJson && userStatus.extraInfoJson["入学年月"]?
                 userStatus.extraInfoJson["入学年月"]: "--"}>
                    {userStatus.extraInfoJson && userStatus.extraInfoJson["入学年月"]?
                    userStatus.extraInfoJson["入学年月"]: "--"}
                </td>
                <td>入学方式</td>
                <td title={userStatus.extraInfoJson && userStatus.extraInfoJson["入学方式"]?
                 userStatus.extraInfoJson["入学方式"]: "--"}>
                    {userStatus.extraInfoJson && userStatus.extraInfoJson["入学方式"]?
                    userStatus.extraInfoJson["入学方式"]: "--"}
                </td>
                <td>就读方式</td>
                <td title={userStatus.studyingWay? userStatus.studyingWay: "--"}>
                    {userStatus.studyingWay? userStatus.studyingWay: "--"}
                </td>
                <td>学生来源</td>
                <td colSpan="2" title={userStatus.extraInfoJson && userStatus.extraInfoJson["学生来源"]?
                 userStatus.extraInfoJson["学生来源"]: "--"}>
                    {userStatus.extraInfoJson && userStatus.extraInfoJson["学生来源"]?
                    userStatus.extraInfoJson["学生来源"]: "--"}
                </td> 
            </tr>
        </table>
        <table className="person-link" border="1" borderColor="#b7e1e5">
            <caption>个人联系方式</caption>
            <tr>
                <td>现住址</td>
                <td colSpan="3" title={userStatus.extraInfoJson && userStatus.extraInfoJson["现住址"]?
                 userStatus.extraInfoJson["现住址"]: "--"}>
                     {userStatus.extraInfoJson && userStatus.extraInfoJson["现住址"]?
                    userStatus.extraInfoJson["现住址"]: "--"}
                </td>
                <td>通信地址</td>
                <td colSpan="3" title={userStatus.extraInfoJson && userStatus.extraInfoJson["通讯地址"]?
                 userStatus.extraInfoJson["通讯地址"]: "--"}>
                    {userStatus.extraInfoJson && userStatus.extraInfoJson["通讯地址"]?
                    userStatus.extraInfoJson["通讯地址"]: "--"}
                </td>
            </tr>
            <tr>
                <td>家庭地址</td>
                <td colSpan="3" title={userStatus.homeAddress? userStatus.homeAddress: "--"}>
                     {userStatus.homeAddress? userStatus.homeAddress: "--"}
                 </td>
                <td>联系电话</td>
                <td title={userStatus.extraInfoJson && userStatus.extraInfoJson["联系电话"]?
                 userStatus.extraInfoJson["联系电话"]: "--"}>
                    {userStatus.extraInfoJson && userStatus.extraInfoJson["联系电话"]?
                    userStatus.extraInfoJson["联系电话"]: "--"}
                </td>
                <td>邮政编码</td>
                <td title={userStatus.extraInfoJson && userStatus.extraInfoJson["邮政编号"]?
                 userStatus.extraInfoJson["邮政编号"]: "--"}>
                    {userStatus.extraInfoJson && userStatus.extraInfoJson["邮政编号"]?
                    userStatus.extraInfoJson["邮政编号"]: "--"}
                </td>
            </tr>
            <tr>
                <td>电子邮箱</td>
                <td colSpan="3" title={userStatus.extraInfoJson && userStatus.extraInfoJson["电子邮箱"]?
                 userStatus.extraInfoJson["电子邮箱"]: "--"}>
                    {userStatus.extraInfoJson && userStatus.extraInfoJson["电子邮箱"]?
                    userStatus.extraInfoJson["电子邮箱"]: "--"}
                </td>
                <td>主页地址</td>
                <td colSpan="3" title={userStatus.extraInfoJson && userStatus.extraInfoJson["主页地址"]?
                 userStatus.extraInfoJson["主页地址"]: "--"}>
                    {userStatus.extraInfoJson && userStatus.extraInfoJson["主页地址"]?
                    userStatus.extraInfoJson["主页地址"]: "--"}
                </td>
            </tr>
        </table>
        <table className="person-more-info" border="1" borderColor="#b7e1e5">
            <caption>个人扩展信息</caption>
            <tr>
                <td width="200">是否独生子女</td>
                <td width="85">{userStatus.isOnlychild? userStatus.isOnlychild: "--"}</td>
                <td width="200">是否受过学前教育</td>
                <td width="85">{userStatus.isAcceptpreschool? userStatus.isAcceptpreschool: "--"}</td>
                <td width="200">是否留守儿童</td>
                <td width="85">{userStatus.isLeftbehindchild? userStatus.isLeftbehindchild: "--"}</td>
                <td width="200">是否进城务工人员随迁子女</td>
                <td width="85">{userStatus.extraInfoJson && userStatus.extraInfoJson["是否进城务工人员随迁子女"]?
                 userStatus.extraInfoJson["是否进城务工人员随迁子女"]: "--"}</td>
            </tr>
            <tr>
                <td width="200">是否孤儿</td>
                <td width="85">{userStatus.extraInfoJson && userStatus.extraInfoJson["是否孤儿"]?
                 userStatus.extraInfoJson["是否孤儿"]: "--"}</td>
                <td width="200">是否烈士或优抚子女</td>
                <td width="85">{userStatus.extraInfoJson && userStatus.extraInfoJson["是否烈士或优抚子女"]?
                 userStatus.extraInfoJson["是否烈士或优抚子女"]: "--"}</td>
                <td width="200">随班就读</td>
                <td width="85">{userStatus.extraInfoJson && userStatus.extraInfoJson["随班就读"]?
                 userStatus.extraInfoJson["随班就读"]: "--"}</td>
                <td width="200">是否需要申请资助</td>
                <td width="85">{userStatus.extraInfoJson && userStatus.extraInfoJson["是否需要申请资助"]?
                 userStatus.extraInfoJson["是否需要申请资助"]: "--"}</td>
            </tr>
            <tr>
                <td width="200">是否享受一补</td>
                <td width="85">{userStatus.extraInfoJson && userStatus.extraInfoJson["是否享受一补"]?
                 userStatus.extraInfoJson["是否享受一补"]: "--"}</td>
                <td width="200">残疾人类型</td>
                <td colSpan="5">{userStatus.extraInfoJson && userStatus.extraInfoJson["残疾人类型"]?
                 userStatus.extraInfoJson["残疾人类型"]: "--"}</td>
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
                Array.isArray(userStatus.resumeJson) &&
                userStatus.resumeJson.map((item, index)=>{
                    return (
                        <tr key={index}>
                            <td width="148">{item.semesterStartTime? item.semesterStartTime: "--"}</td>
                            <td width="148">{item.semesterEndTime? item.semesterEndTime: "--"}</td>
                            <td width="395">{item.school? item.school: "--"}</td>
                            <td width="160">{item.learningContent? item.learningContent: "--"}</td>
                            <td width="140">{item.duty? item.duty: "--"}</td>
                            <td width="150">{item.certifier? item.certifier: "--"}</td>
                        </tr>
                    )
                })
            }
            
        </table>
        <table className="transport-info" border="1" borderColor="#b7e1e5">
            <caption>上下学交通方式</caption>
            <tr>
                <td width="200">上下学距离(千米)</td>
                <td width="178">{userStatus.extraInfoJson && userStatus.extraInfoJson["上下学距离（千米）"]?
                 userStatus.extraInfoJson["上下学距离（千米）"]: "--"}</td>
                <td width="200">上下学交通方式</td>
                <td width="178">{userStatus.extraInfoJson && userStatus.extraInfoJson["上下学交通方式"]?
                 userStatus.extraInfoJson["上下学交通方式"]: "--"}</td>
                <td width="200">是否需要乘坐校车</td>
                <td width="178">{userStatus.extraInfoJson && userStatus.extraInfoJson["是否需要乘坐校车"]?
                 userStatus.extraInfoJson["是否需要乘坐校车"]: "--"}</td>
            </tr>
        </table>
        {
            Array.isArray(userStatus.guardianJson) &&
            userStatus.guardianJson.map((item, index)=>{
                return (
                    <table className="family-info" border="1" borderColor="#b7e1e5">
                        {
                            index == 0?
                            <caption>家庭成员或监护人信息</caption>:
                            ""
                        }
                        <tr>
                            <td>姓名</td>
                            <td>{item.name? item.name: "--"}</td>
                            <td>关系</td>
                            <td>{item.relationship? item.relationship: "--"}</td>
                            <td>身份证件类型</td>
                            <td>{item.idCardType? item.idCardType: "--"}</td>
                            <td>身份证件号码</td>
                            <td>{item.idCardNum? item.idCardNum: "--"}</td> 
                        </tr>
                        <tr>
                            <td>民族</td>
                            <td>{item.nation? item.nation: "--"}</td>
                            <td>是否监护人</td>
                            <td>{item.isGuardian? item.isGuardian: "--"}</td>
                            <td>户口所在地</td>
                            <td>{item.censusPlace? item.censusPlace: "--"}</td>
                            <td>联系方式</td>
                            <td>{item.tel? item.tel: "--"}</td> 
                        </tr>
                        <tr>
                            <td>现住址</td>
                            <td colSpan="3">{item.address? item.address: "--"}</td>
                            <td>工作单位</td>
                            <td>{item.serviceUnit? item.serviceUnit: "--"}</td>
                            <td>职务</td>
                            <td>{item.position? item.position: "--"}</td>
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
                <td>{userStatus.extraInfoJson && userStatus.extraInfoJson["家庭人口"]?
                 userStatus.extraInfoJson["家庭人口"]: "--"}</td>
                <td>赡养人口</td>
                <td>{userStatus.extraInfoJson && userStatus.extraInfoJson["赡养人口"]?
                 userStatus.extraInfoJson["赡养人口"]: "--"}</td>
                <td>家庭年收入</td>
                <td>{userStatus.extraInfoJson && userStatus.extraInfoJson["家庭年收入"]?
                 userStatus.extraInfoJson["家庭年收入"]: "--"}</td>
                <td>主要收入来源</td>
                <td>{userStatus.extraInfoJson && userStatus.extraInfoJson["主要收入来源"]?
                 userStatus.extraInfoJson["主要收入来源"]: "--"}</td>
            </tr>
            <tr>
                <td>具备劳动力人数</td>
                <td>{userStatus.extraInfoJson && userStatus.extraInfoJson["具备劳动力人数"]?
                 userStatus.extraInfoJson["具备劳动力人数"]: "--"}</td>
                <td>是否低保</td>
                <td>{userStatus.extraInfoJson && userStatus.extraInfoJson["是否低保"]?
                 userStatus.extraInfoJson["是否低保"]: "--"}</td>
                <td>就学地低保线</td>
                <td>{userStatus.extraInfoJson && userStatus.extraInfoJson["就学地低保线"]?
                 userStatus.extraInfoJson["就学地低保线"]: "--"}</td>
                <td>困难程度</td>
                <td>{userStatus.extraInfoJson && userStatus.extraInfoJson["困难程度"]?
                 userStatus.extraInfoJson["困难程度"]: "--"}</td> 
            </tr>
            <tr>
                <td>是否父母丧失劳动能力</td>
                <td>{userStatus.extraInfoJson && userStatus.extraInfoJson["是否父母丧失劳动能力"]?
                 userStatus.extraInfoJson["是否父母丧失劳动能力"]: "--"}</td>
                <td>是否农村绝对贫困家庭</td>
                <td>{userStatus.extraInfoJson && userStatus.extraInfoJson["是否农村绝对贫困家庭"]?
                 userStatus.extraInfoJson["是否农村绝对贫困家庭"]: "--"}</td>
                <td colSpan="3">是否经民政部门确认的农村特困救助范围的家庭子女</td>
                <td>{userStatus.extraInfoJson && userStatus.extraInfoJson["是否经民政部门确认的农村特困救助范围的家庭子女"]?
                 userStatus.extraInfoJson["是否经民政部门确认的农村特困救助范围的家庭子女"]: "--"}</td>
            </tr>
            <tr>
                <td>是否军烈属</td>
                <td>{userStatus.extraInfoJson && userStatus.extraInfoJson["是否军烈属"]?
                 userStatus.extraInfoJson["是否军烈属"]: "--"}</td>
                <td>家庭是否五保户</td>
                <td>{userStatus.extraInfoJson && userStatus.extraInfoJson["家庭是否五保户"]?
                 userStatus.extraInfoJson["家庭是否五保户"]: "--"}</td>
                <td colSpan="3">家庭是否有大病患者</td>
                <td>{userStatus.extraInfoJson && userStatus.extraInfoJson["家中是否有大病患者"]?
                 userStatus.extraInfoJson["家中是否有大病患者"]: "--"}</td>
            </tr>
            <tr>
                <td>家庭是否遭受自然灾害</td>
                <td>{userStatus.extraInfoJson && userStatus.extraInfoJson["家庭是否遭受自然灾害"]?
                 userStatus.extraInfoJson["家庭是否遭受自然灾害"]: "--"}</td>
                <td colSpan="2">自然灾害具体情况描述</td>
                <td colSpan="4">{userStatus.extraInfoJson && userStatus.extraInfoJson["自然灾害具体情况描述"]?
                 userStatus.extraInfoJson["自然灾害具体情况描述"]: "--"}</td>
            </tr>
            <tr>
                <td>家庭失业人数</td>
                <td>{userStatus.extraInfoJson && userStatus.extraInfoJson["家庭失业人数"]?
                 userStatus.extraInfoJson["家庭失业人数"]: "--"}</td>
                <td>家庭欠债金额</td>
                <td>{userStatus.extraInfoJson && userStatus.extraInfoJson["家庭欠债金额"]?
                 userStatus.extraInfoJson["家庭欠债金额"]: "--"}</td>
                <td>欠债原因</td>
                <td colSpan="3">{userStatus.extraInfoJson && userStatus.extraInfoJson["欠债原因"]?
                 userStatus.extraInfoJson["欠债原因"]: "--"}</td>
            </tr>
        </table>
        
      </div>
    );
  }
  
  const mapStateToProps = (state) => {
    let {
      commonData: { levelHash, userInfo },
    } = state;
    return { levelHash, userInfo };
  };
  export default connect(mapStateToProps)(memo(forwardRef(StucherCount)));
  