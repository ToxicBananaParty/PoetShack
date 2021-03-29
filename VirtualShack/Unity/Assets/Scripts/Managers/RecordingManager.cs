using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using UnityEngine;
using UnityEngine.Networking;
using UnityGoogleDrive;
using File = UnityGoogleDrive.Data.File;
using Random = UnityEngine.Random;

public class RecordingManager : MonoBehaviour
{
    public AudioSource audioSource;
    public static int myNum;
    
    void Start()
    {
        myNum = 0;
        DownloadFiles();
        GetRecordingNum();
    }

    // Update is called once per frame
    void Update()
    {
        
    }

    private void OnDestroy()
    {
        foreach(string fileName in Directory.GetFiles(Application.persistentDataPath))
        {
            if(Path.GetFileName(fileName).StartsWith("virtualshackrecording"))
                System.IO.File.Delete(fileName);
        }
    }

    public static int GetRecordingNum()
    {
        int maxNum = 0;
        GoogleDriveFiles.List().Send().OnDone += list =>
        {
            foreach (File file in list.Files)
            {
                if (!file.Name.Contains("virtualshackrecording"))
                    continue;
                string[] fileName = file.Name.Split('_');
                int currentNum = FindIntInString(fileName[fileName.Length - 1]);
                if (currentNum >= myNum)
                    myNum = currentNum + 1;
            }
            //Debug.Log(myNum);
        };
        return maxNum;
    }

    public static int FindIntInString(string str) {
        int val;
        string toParse = String.Empty;
        for (int i = 0; i < str.Length; i++) {
            if (Char.IsDigit(str[i]))
                toParse += str[i];
        }

        val = Int32.Parse(toParse);
        
        return val;
    }

    void Submit() {
        AudioClip myClip = SavWav.TrimSilence(audioSource.clip, 0.1f);
        string fileName = "virtualshackrecording_" + myNum;
        string outputLocation = SavWav.Save(fileName, myClip);

        Byte[] content = System.IO.File.ReadAllBytes(outputLocation);
        File file = new File
        {
            Name = Path.GetFileName(outputLocation), Content = content
        };

        GoogleDriveFiles.Create(file).Send().OnDone += result => {
            Debug.Log("Uploaded: " + result.Name);
        };
        myNum++;
    }

    void DownloadFiles()
    {
        GoogleDriveFiles.List().Send().OnDone += list =>
        {
            foreach (File listedFile in list.Files) {
                if (listedFile.Name.StartsWith("virtualshackrecording")) {
                    GoogleDriveFiles.DownloadAudio(listedFile.Id, AudioType.WAV).Send().OnDone += file =>
                    {
                        SavWav.Save("downloaded_" + listedFile.Name, file.AudioClip);
                    };
                }
            }
            
            
        };
    }

    public void PlayRandomPoem()
    {
        audioSource.Stop();
        List<string> files = new List<string>();
        foreach(string listedFile in Directory.GetFiles(Application.persistentDataPath))
        {
            if(listedFile.Contains("virtualshackrecording"))
                files.Add(listedFile);
        }

        StartCoroutine(GetAudioClip(files[Random.Range(0, files.Count)]));
    }

    private IEnumerator GetAudioClip(string fileName)
    {
        using (UnityWebRequest www = UnityWebRequestMultimedia.GetAudioClip(fileName, AudioType.WAV)) {
            yield return www.SendWebRequest();

            if (www.isDone) {
                audioSource.clip = DownloadHandlerAudioClip.GetContent(www);
                audioSource.Play();
            }
        }
    }

    public void StartRecording()
    {
        
        if (Microphone.devices.Length <= 0)
        {
            Debug.LogError("No microphone detected!");
        }
        else
        {
            int minFreq, maxFreq;
            Microphone.GetDeviceCaps(null, out minFreq, out maxFreq);
            if (minFreq == 0 && maxFreq == 0)
                maxFreq = 44100;

            audioSource.clip = Microphone.Start(null, false, 240, maxFreq);
            Debug.Log("Starting recording");
        }
    }

    Byte[] GetAudioData(AudioClip clip)
    {
        var samples = new float[clip.samples];

        clip.GetData(samples, 0);

        Int16[] intData = new Int16[samples.Length];
        //converting in 2 float[] steps to Int16[], //then Int16[] to Byte[]

        Byte[] bytesData = new Byte[samples.Length * 2];
        //bytesData array is twice the size of
        //dataSource array because a float converted in Int16 is 2 bytes.

        int rescaleFactor = 32767; //to convert float to Int16

        for (int i = 0; i<samples.Length; i++) {
            intData[i] = (short) (samples[i] * rescaleFactor);
            Byte[] byteArr = new Byte[2];
            byteArr = BitConverter.GetBytes(intData[i]);
            byteArr.CopyTo(bytesData, i * 2);
        }

        return bytesData;
    }

    public void StopRecording()
    {
        Microphone.End(null);
        Debug.Log("Submitting");
        Submit();
    }
}
