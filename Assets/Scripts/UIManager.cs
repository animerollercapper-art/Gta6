using UnityEngine;
using UnityEngine.UI;

public class UIManager : MonoBehaviour
{
    public Text healthText;
    public Text ammoText;
    public Text missionText;

    private static UIManager instance;

    void Awake()
    {
        instance = this;
    }

    public static void UpdateHealth(int health)
    {
        if (instance != null && instance.healthText != null)
        {
            instance.healthText.text = "Health: " + health;
        }
    }

    public static void UpdateAmmo(int ammo)
    {
        if (instance != null && instance.ammoText != null)
        {
            instance.ammoText.text = "Ammo: " + ammo;
        }
    }

    public static void UpdateMission(string missionName)
    {
        if (instance != null && instance.missionText != null)
        {
            instance.missionText.text = "Mission: " + missionName;
        }
    }
}
