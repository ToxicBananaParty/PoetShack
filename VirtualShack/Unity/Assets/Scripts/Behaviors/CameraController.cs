using System;
using System.Collections;
using System.Collections.Generic;
using Cinemachine;
using UnityEngine;

public class CameraController : MonoBehaviour
{
    public CinemachineFreeLook.Orbit[] orbits;
    
    private Camera firstPersonCamera, thirdPersonCamera;
    
    void Start()
    {
        CinemachineCore.GetInputAxis = GetAxisCustom;
        orbits = GetComponent<CinemachineFreeLook>().m_Orbits;
        thirdPersonCamera = Camera.main;
        //firstPersonCamera = GameObject.Find("/Game/Player/Camera").GetComponent<Camera>();
        //firstPersonCamera.enabled = false;
    }

    void Update()
    {
        float zoom = Input.GetAxis("Mouse ScrollWheel");
        if (zoom > 0f || zoom < 0f)
        {
            for (int i = 0; i < orbits.Length; i++)
            {
                orbits[i].m_Radius -= Input.mouseScrollDelta.y;
                if (orbits[i].m_Radius < 1f)
                    orbits[i].m_Radius = 1f;
                else if (orbits[i].m_Radius > 50f)
                    orbits[i].m_Radius = 50f;
            }
        }
        
        if (Input.GetKeyDown(KeyCode.F) && Player.player.thirdPerson)
        {
            Player.player.thirdPerson = false;
            firstPersonCamera.enabled = true;
            thirdPersonCamera.enabled = false;
        }
        else if (Input.GetKeyDown(KeyCode.F))
        {
            Player.player.thirdPerson = true;
            firstPersonCamera.enabled = false;
            thirdPersonCamera.enabled = true;
        }
    }

    float GetAxisCustom(string axisName)
    {
        switch (axisName)
        {
            case "Mouse X" when Input.GetMouseButton(1):
                return Input.GetAxis("Mouse X");
            case "Mouse X":
                return 0f;
            case "Mouse Y" when Input.GetMouseButton(1):
                return Input.GetAxis("Mouse Y");
            case "Mouse Y":
                return 0f;
            default:
                return Input.GetAxis(axisName);
        }
    }
}
