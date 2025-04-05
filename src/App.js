import React, { useState, useEffect } from "react";
import "./css/main.scss";
import DriversPanel from "./components/DrivesPanel";
var path =
	typeof window.require === "function" ? window.require("path") : undefined;
const distPath = "C:\\";

function App() {
	//states
	const [searchPattern, setSearchPattern] = useState("");
	const [filesList, setFilesList] = useState([]);
	const [currentFileName, setCurrentFileName] = useState("");
	const [currentDistPath, setCurrentDistPath] = useState(distPath);
	const [drives, setDrives] = useState([]);

	//variables
	const displayedList = filesList//filesList.filter(item => item.includes(searchPattern))
	
	//#region functions
	const updateFileList = async (path) => {
		try{
			if(path.includes("/..")){
				setFilesList(prev => {
					const array = [...prev]
					array.pop();
					return array;
				});
			} else {
				const fileList = await window.files.filesList(path || currentDistPath) 
				setFilesList(prev => [...prev, fileList]);
			}
		}catch(exception){
			console.error(exception)
			const backPath = await window.files.pathJoin(currentDistPath, "/..");
			setCurrentDistPath(backPath);
		}
	};

	const handleFileSelection = async (event) => {
		const isFile = await window.files.isFile(currentDistPath, event.target.value);
		const targetPath =await window.files.pathJoin(currentDistPath, event.target.value);
		if(isFile){
			setCurrentFileName(targetPath);
		}else {
			setCurrentDistPath(targetPath);
		}
	};

	const handleDeleteFile = () => {
		// fs.unlink(path.join(currentDistPath, currentFileName), err => {
		// 	if (err) throw err;
		// 	setCurrentFileName("");
		// });
	};

	const handleBack = async () => {
		const backPath = await window.files.pathJoin(currentDistPath, "/..");
		setCurrentDistPath(backPath);
	};

	const driveClick = event => {
		setCurrentDistPath(event.currentTarget.textContent);
		setCurrentFileName("");
	};
	//#endregion

	//#region effects

	useEffect(() => {
		updateFileList(currentDistPath);
	}, [currentDistPath]);
	//#endregion

	return (
		<div className="main-body">
			<div className="content">
				<DriversPanel
					drives={drives}
					setDrives={setDrives}
					driveClick={driveClick}
				/>
				{/* <div className="finder">
					<input type="text" onInput={(e) => {
						setSearchPattern(e.currentTarget.value ?? "");
					}}></input>
				</div> */}
				<div className="files-list-wrapper">
					<div className="file-list-title-wrapper">
						<div onClick={handleBack} style={{cursor: "pointer"}}>
							{`..\\`}
						</div>
						<div className="current-dir">{currentDistPath}</div>
					</div>
					<div className="files-panels">
						{displayedList.map(list => {
							return <div className="files-list">
							{list?.map((item, i) => {
								return (
									<input
										type="text"
										readOnly
										className="list-item"
										tabIndex={i}
										onMouseDown={handleFileSelection}
										value={item}
									/>
								);
							})}
						</div>})}
					</div>
					<div className="file-menu">
						<div className="item">
							Download
						</div>
						<div className="item" onClick={handleDeleteFile}>
							Delete
						</div>
						<div className="item">
							Info
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;
