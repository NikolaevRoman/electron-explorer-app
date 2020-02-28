import React, { useEffect } from "react";
const drivelist = window.require("drivelist");
const networkDrive =
	typeof window.require === "function"
		? window.require("windows-network-drive")
		: undefined;

export default function DriversPanel({ drives, setDrives, driveClick }) {
	const findAllDrives = async () => {
		const drives = await drivelist.list();
		const networkDrives = networkDrive.isWinOs()
			? await networkDrive.list()
			: [];
		setDrives(() => {
			let drivesList = [];
			drives.forEach(drive => {
				drivesList.push(drive.mountpoints[0].path);
			});
			for (let drive in networkDrives) {
				drivesList.push(`${drive}:\\`);
			}
			return drivesList;
		});
	};

	useEffect(() => {
		findAllDrives();
	}, []);
	return (
		<>
			<div className="drives-menu">
				{drives.map((item, i) => {
					return (
						<div key={item + i} className="item" onClick={driveClick}>
							{item}
						</div>
					);
				})}
			</div>
		</>
	);
}
