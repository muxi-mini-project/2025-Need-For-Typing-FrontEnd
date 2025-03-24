import SelectPage from "../components/selectPage"
export default function MusicSelectPage(){

    return (
        <>
            <SelectPage 
                src={"/音游切换页面.png"} 
                sTop={'14rem'} 
                bTop={'26rem'}
                setting = "/MusicSetting" 
                path="/MusicSelectPage" 
                select={"/CarSelectPage"}
                main={"/MusicMainPage"}
                userInterface={"/UserInterfaceMusic"}/>
                
        </>
    )
}

