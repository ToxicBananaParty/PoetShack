using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using UnityGoogleDrive;
using File = UnityGoogleDrive.Data.File;

public class LoadingScreen : MonoBehaviour {
	public Slider slider;

	private GoogleDriveFiles.DownloadAudioRequest request;
	private RangeInt range;
	
	void Start() {
		StartCoroutine(DownloadPoems());
	}

	IEnumerator DownloadPoems() {
		int numFiles = 0;
		List<string> toDownload = new List<string>();
		bool isDone = false;
		
		GoogleDriveFiles.List().Send().OnDone += list => {
			foreach (File file in list.Files) {
				if (!file.Name.Contains("virtualshackrecording"))
					continue;
				toDownload.Add(file.Id);
				numFiles++;
			}

			for (int i = 0; i < toDownload.Count; i++) {
				request = GoogleDriveFiles.DownloadAudio(toDownload[i], AudioType.WAV);
				request.Send().OnDone += file => {
					SavWav.Save("poem_" + i, file.AudioClip);
					slider.value = i;
				};
			}

			isDone = true;
		};

		while (!isDone)
			yield return null;
	}
}
