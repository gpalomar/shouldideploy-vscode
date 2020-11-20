import axios from 'axios';
import * as moment from 'moment-timezone';
import * as vscode from 'vscode';

const timezone = moment.tz.guess();

let myStatusBarItem: vscode.StatusBarItem;

export function activate({ subscriptions }: vscode.ExtensionContext) {

	// Register a command that is invoked when the status bar item is selected.
	const myCommandId = 'shouldideploy.clickStatusBar';
	subscriptions.push(vscode.commands.registerCommand(myCommandId, () => updateStatusBarItem()));

	// Create a new status bar item that we can now manage.
	myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	myStatusBarItem.command = myCommandId;
	subscriptions.push(myStatusBarItem);

	// Update status bar item once at start.
	updateStatusBarItem();
}

interface IShoulDeployAPIResponse {
	shouldideploy: boolean;
	message: string;
}

async function updateStatusBarItem(): Promise<void> {
	const response = await axios.get(`https://shouldideploy.today/api?tz=${timezone}`);
	if(response.status === 200) {
		const apiData = response.data as IShoulDeployAPIResponse;
		if(!apiData.shouldideploy) {
			myStatusBarItem.color = '#cc0000';
		}
		myStatusBarItem.text = `${apiData.shouldideploy ? '$(check)' : '$(warning)'} ${apiData.message.toUpperCase()}`;
	} else {
		myStatusBarItem.text = `$(megaphone) shouldideploy API error`;
	}
	myStatusBarItem.tooltip = 'Should I Deploy?';
	myStatusBarItem.show();
}

// This method is called when your extension is deactivated
export function deactivate() {}
