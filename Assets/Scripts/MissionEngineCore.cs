using System.Collections.Generic;
using UnityEngine;

public class MissionEngineCore : MonoBehaviour
{
    public List<Mission> missions = new List<Mission>();
    public int currentIndex = 0;

    public bool IsComplete => currentIndex >= missions.Count;

    public void AdvanceMission()
    {
        if (!IsComplete)
        {
            currentIndex++;
        }
    }
}
