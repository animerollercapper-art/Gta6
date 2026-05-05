using UnityEngine;

public class GameManager : MonoBehaviour
{
    public PlayerControllerCore player;
    public MissionEngineCore missionEngine;
    public CombatSystemCore combatSystem;

    void Start()
    {
        UIManager.UpdateHealth(player.health);
        if (combatSystem != null)
        {
            UIManager.UpdateAmmo(combatSystem.ammo);
        }

        UpdateMissionProgress();
    }

    void Update()
    {
        if (player != null)
        {
            UIManager.UpdateHealth(player.health);
        }
    }

    public void UpdateMissionProgress()
    {
        if (missionEngine != null && missionEngine.currentIndex < missionEngine.missions.Count)
        {
            string currentMission = missionEngine.missions[missionEngine.currentIndex].name;
            UIManager.UpdateMission(currentMission);
        }
        else
        {
            UIManager.UpdateMission("All Missions Complete!");
        }
    }
}
