import React, { useEffect } from "react";

export default function DriversPanel({ drives, setDrives, driveClick }) {
	const findAllDrives = async () => {
		const drives = await window.drivers?.localList();
		const networkDrives = window.drivers?.isWinOs() ?? []
			? await window.drivers.networkList()
			: [];
		console.log("drives => ", drives);
		console.log("network drives => ", networkDrives);
		setDrives(() => {
			let drivesList = [];
			drives.forEach(drive => {
				drive.mountpoints.forEach(point => {
					drivesList.push(point.path);
				})
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
