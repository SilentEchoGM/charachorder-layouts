# Serial API
The Serial API allows developers to add and remove chords and change configurational parameters on the CharaChorder device. The serial connection operates at a baud rate of 115200 bps. In general a success returns a 0 at the end, while a failure returns a number greater than zero, which represents an error code.


## Commands Overview
Commands are all caps ASCII characters. The return is always 1 line and includes the command in the return line along with some of the relevant input arguments as well. This makes it more restful and stateless as compared to previous versions of the SerialAPI.
| Dev Status | Command | Description |
| - | - | - |
| available | CMD | Lists available commands. |
| available | ID | Identifies device, such as 'CHARACHORDER ONE M0'. |
| available | VER | Returns the current firmware version, such as '1.5.16' |
| available | CML | Used for getting, setting (adding or overwriting), and deleting chordmaps. |
| available | VAR | Used for getting and settings parameters. This includes setting custom chordmaps. |
| available | RST | Restarts/reboots the microcontroller hardware. It has additional arguments for Factory and Bootloader. |
| available | RAM | prints the current amount of SRAM available. This is primarily used for debugging. |
| available | SIM | Simulates/injects a chord and outputs the chord output if the chord exists in the chord library. This is primarily used for debugging. |



________________________________
### CMD
The CMD command lists out all of the commands in the Serial API. This shouldn't be necessary if you already have this Serial API documentation though. All the commands are returned in one comma-delimited line. all commands are uppercase ASCII characters.

| I/O | Index | Name | Type | Example | Notes |
| - | - | - | - | - | - |
| INPUT | 0 | Command | Chars | CMD | |
| OUTPUT | 0 | Command | Chars | CMD | |
| OUTPUT | 1 | Command List | Chars | CMD,ID,VER,CML,VAR,RST,RAM,SIM,FACTORY,BOOTLOADER | comma delimited |

Example(s):
| I/O | Message |
| - | - |
| INPUT | CMD |
| OUTPUT | CMD CMD,ID,VER,CML,VAR,RST,RAM,SIM,FACTORY,BOOTLOADER |

```python
ser.write(b'CMD\r\n');
```



________________________________
### ID
The ID command returns the ASCII name of the device, including the chipset code. This can be used to identify the correct serial device attached to the computer.

| I/O | Index | Name | Type | Example | Notes |
| - | - | - | - | - | - |
| INPUT | 0 | Command | Chars | ID | |
| OUTPUT | 0 | Command | Chars | ID | |
| OUTPUT | 1 | Company | Chars | CHARACHORDER | |
| OUTPUT | 2 | Device | Chars | ONE | ONE or LITE |
| OUTPUT | 3 | Chipset | Chars | M0 | M0 or S2 |

Example(s):
| I/O | Message |
| - | - |
| INPUT | ID |
| OUTPUT | ID CHARACHORDER ONE M0 |

```python
ser.write(b'ID\r\n');
```



________________________________
### VER
The VER command returns the current version of the firmware.

| I/O | Index | Name | Type | Example | Notes |
| - | - | - | - | - | - |
| INPUT | 0 | Command | Chars | VER | |
| OUTPUT | 0 | Command | Chars | VER | |
| OUTPUT | 1 | Command List | Chars | 1.5.16 | period delimited of MAJOR.MINOR.BUILD |

Example(s):
| I/O | Message |
| - | - |
| INPUT | VER |
| OUTPUT | VER 1.5.16 |

```python
ser.write(b'VER\r\n');
```



________________________________
### CML
The CML command provides access to the Chordmap Library.

| CML SubCommand | Code | Description |
| - | - | - |
| GET_CHORDMAP_COUNT | C0 | Gets the (decimal) number of chordmaps. |
| GET_CHORDMAP_BY_INDEX | C1 | Gets a chordmap by the index number (hexadecimal uint16) if within range. |
| GET_CHORDMAP_BY_CHORD | C2 | Gets a chordmaps by the chord (hexadecimal) value if it is found in the library. |
| SET_CHORDMAP_BY_CHORD | C3 | Sets a chordmap with a chord and output bytes (hexadecimal). |
| DEL_CHORDMAP_BY_CHORD | C4 | Deletes a chordmap from the library if the chord exists. |

| GET_CHORDMAP_COUNT | Index | Name | Type | Example | Notes |
| - | - | - | - | - | - |
| INPUT | 0 | Command | Chars | CML | |
| INPUT | 1 | SubCommand | Hexadecimal CML Code | C0 | get chordmap count |
| OUTPUT | 0 | Command | Chars | CML | |
| OUTPUT | 1 | SubCommand | Hexadecimal CML Code | C0 | |
| OUTPUT | 2 | Data Out | Decimal Number | 1347 | |

| GET_CHORDMAP_BY_INDEX | Index | Name | Type | Example | Notes |
| - | - | - | - | - | - |
| INPUT | 0 | Command | Chars | CML | |
| INPUT | 1 | SubCommand | Hexadecimal CML Code | C1 | get chordmap by index |
| INPUT | 2 | Index | Decimal | 522 | |
| OUTPUT | 0 | Command | Chars | CML | |
| OUTPUT | 1 | SubCommand | Hexadecimal CML Code | C1 | |
| OUTPUT | 2 | Index | Decimal | 522 | |
| OUTPUT | 3 | Chord | Hexadecimal Number | 000000000000C1AE46DED6731EC20F2A | this will be 0 if index is out of bounds |
| OUTPUT | 4 | Phrase | Hexadecimal CCActionCodes List | 6361727065206469656D | "carpe diem"; this will be "0" if index is out of bounds |

| GET_CHORDMAP_BY_CHORD | Index | Name | Type | Example | Notes |
| - | - | - | - | - | - |
| INPUT | 0 | Command | Chars | CML | |
| INPUT | 1 | SubCommand | Hexadecimal CML Code | C2 | get chordmap by chord |
| INPUT | 2 | Chord | Hexadecimal Number | 000000000000C1AE46DED6731EC20F2A | |
| OUTPUT | 0 | Command | Chars | CML | |
| OUTPUT | 1 | SubCommand | Hexadecimal CML Code | C2 | |
| OUTPUT | 2 | Chord | Hexadecimal Number | 000000000000C1AE46DED6731EC20F2A | |
| OUTPUT | 3 | Phrase | Hexadecimal CCActionCodes List | 6361727065206469656D | "carpe diem"; this will be "0" if chordmap is not in the library |

| SET_CHORDMAP_BY_CHORD | Index | Name | Type | Example | Notes |
| - | - | - | - | - | - |
| INPUT | 0 | Command | Chars | CML | |
| INPUT | 1 | SubCommand | Hexadecimal CML Code | C3 | set chordmap by chord |
| INPUT | 2 | Chord | Hexadecimal Number | 000000000000C1AE46DED6731EC20F2A | |
| INPUT | 3 | Phrase | Hexadecimal CCActionCodes List | 6361727065206469656D | "carpe diem" |
| OUTPUT | 0 | Command | Chars | CML | |
| OUTPUT | 1 | SubCommand | Hexadecimal CML Code | C3 | |
| OUTPUT | 2 | Chord | Hexadecimal Number | 000000000000C1AE46DED6731EC20F2A | |
| OUTPUT | 3 | Phrase | Hexadecimal CCActionCodes List | 6361727065206469656D | "carpe diem"; this will be "0" if there was a problem adding this chordmap to the library |
| OUTPUT | 4 | Success | Boolean Number | 0 | This will be "0" on success, or greater than zero for an error if the chordmap did not exist or the deletion was unsuccessful |

| DEL_CHORDMAP_BY_CHORD | Index | Name | Type | Example | Notes |
| - | - | - | - | - | - |
| INPUT | 0 | Command | Chars | CML | |
| INPUT | 1 | SubCommand | Hexadecimal CML Code | C4 | delete chordmap by chord |
| INPUT | 2 | Chord | Hexadecimal Number | 000000000000C1AE46DED6731EC20F2A | |
| OUTPUT | 0 | Command | Chars | CML | |
| OUTPUT | 1 | SubCommand | Hexadecimal CML Code | C4 | |
| OUTPUT | 2 | Chord | Hexadecimal Number | 000000000000C1AE46DED6731EC20F2A | this will be "0" if the chordmap did not exist or the deletion was unsuccessful |
| OUTPUT | 3 | Success | Boolean Number | 0 | This will be "0" on success, or greater than zero for an error if the chordmap did not exist or the deletion was unsuccessful |




Example(s):
| GET_CHORDMAP_COUNT: | Message | Notes |
| - | - | - |
| INPUT | CML C0 | |
| OUTPUT | CML C0 1347 | |

| GET_CHORDMAP_BY_INDEX: | Message | Notes |
| - | - | - |
| INPUT | CML C1 522 | |
| OUTPUT | CML C1 000000000000C1AE46DED6731EC20F2A 6361727065206469656D | |

| GET_CHORDMAP_BY_CHORD: | Message | Notes |
| - | - | - |
| INPUT | CML C2 00000000E4E2B0160F84B20ACE7638C0 | |
| OUTPUT | CML C2 00000000E4E2B0160F84B20ACE7638C0 6361727065206469656D | |

| SET_CHORDMAP_BY_CHORD: | Message | Notes |
| - | - | - |
| INPUT | CML C3 00000000E4E2B0160F84B20ACE7638C0 6361727065206469656D | |
| OUTPUT | CML C3 00000000E4E2B0160F84B20ACE7638C0 6361727065206469656D 0 | |

| DEL_CHORDMAP_BY_CHORD: | Message | Notes |
| - | - | - |
| INPUT | CML C4 00000000E4E2B0160F84B20ACE7638C0 | |
| OUTPUT | CML C4 00000000E4E2B0160F84B20ACE7638C0 0 | |






________________________________
### VAR
The VAR command provides access to customizable parameters. This includes access to custom keymaps.

| VAR SubCommand | Code | Description |
| - | - | - |
| CMD_VAR_COMMIT | B0 | Commits any parameter changes to persistent memory. |
| CMD_VAR_GET_PARAMETER | B1 | Gets the value of a parameter. |
| CMD_VAR_SET_PARAMETER | B2 | Sets the value of a parameter. |
| CMD_VAR_GET_KEYMAP | B3 | Gets the value of a key in a keymap. |
| CMD_VAR_SET_KEYMAP | B4 | Sets the value of a key in a keymap. |

| Keymap Codes | Code | Description |
| - | - | - |
| Primary | A1 | The default primary keymap. In the CharaChorder One this is called the Alpha keymap, while on the CharaChorder Lite this defaults to a Qwerty layout. |
| Secondary | A2 | The default secondary keymap. In the CharaChorder One this is called the Num-shift keymap, while on the CharaChorder Lite this provides some additional function and numpad keys. |
| Tertiary | A3 | The default tertiary keymap. In the CharaChorder One this is called the Function keymap, while on the CharaChorder Lite this is a copy of the secondary keymap. |

| Parameter Codes | Code | Description |
| - | - | - |
| Enable Serial Header | 01 | boolean 0 or 1, default is 0 |
| Enable Serial Logging | 02 | boolean 0 or 1, default is 0 |
| Enable Serial Debugging | 03 | boolean 0 or 1, default is 0 |
| Enable Serial Raw | 04 | boolean 0 or 1, default is 0 |
| Enable Serial Chord | 05 | boolean 0 or 1, default is 0 |
| Enable Serial Keyboard | 06 | boolean 0 or 1, default is 0 |
| Enable Serial Mouse | 07 | boolean 0 or 1, default is 0 |
| Enable USB HID Keyboard | 11 | boolean 0 or 1, default is 1 |
| Enable Character Entry | 12 | boolean 0 or 1 |
| GUI-CTRL Swap Mode | 13 | Boolean 0 or 1; 1 swaps keymap 0 and 1. (CCL only) |
| Key Scan Duration | 14 | scan rate described in milliseconds; default is 5ms = 200Hz |
| Key Debounce Press Duration | 15 | debounce time in milliseconds; default is 20ms |
| Key Debounce Release Duration | 16 | debounce time in milliseconds; default is 20ms |
| Enable USB HID Mouse | 21 | boolean 0 or 1; default is 1 |
| Slow Mouse Speed | 22 | pixels to move at the mouse poll rate; default is 2 = 100px/s |
| Fast Mouse Speed | 23 | pixels to move at the mouse poll rate; default is 10 = 500px/s |
| Enable Active Mouse | 24 | boolean 0 or 1; moves mouse back and forth every 60s |
| Mouse Scroll Speed | 25 | default is 1 |
| Mouse Poll Duration | 26 | poll rate described in milliseconds; default is 20ms = 50Hz |
| Enable Chording | 31 | boolean 0 or 1 |
| Enable Chording Character Counter Killer | 32 | boolean 0 or 1; default is 1 |
| Chording Character Counter Killer Timer | 33 | 0-255 deciseconds; default is 40 or 4.0 seconds |
| Chord Detection Press Tolerance(ms) | 34 | 1-50 milliseconds |
| Chord Detection Release Tolerance(ms) | 35 | 1-50 milliseconds |
| Enable Spurring | 41 | boolean 0 or 1; default is 1 |
| Enable Spurring Character Counter Killer | 42 | boolean 0 or 1; default is 1 |
| Spurring Character Counter Killer Timer | 43 | 0-255 seconds; default is 240 |
| Enable Arpeggiates | 51 | boolean 0 or 1; default is 1 |
| Arpeggiate Tolerance | 54 | in deciseconds |
| Enable Compound Chording (coming soon) | 61 | boolean 0 or 1; default is 1 |
| LED Brightness | 81 | 0-50 (CCL only) |
| LED Color Code | 82 | Color Codes to be listed (CCL only) |
| Enable LED Key Highlight (coming soon) | 83 | boolean 0 or 1 |
| Operating System | 91 | OS Codes to be listed |
| Enable Realtime Feedback | 92 | boolean 0 or 1; default is 1 |


| Operating System Codes | Code | Description |
| - | - | - |
| Windows | 0 | |
| Mac | 1 | |
| Linux | 2 | |
| iOS | 3 | |
| Android | 4 | |
| Unknown | 255 | |



| CMD_VAR_COMMIT: | Index | Name | Type | Example | Notes |
| - | - | - | - | - | - |
| INPUT | 0 | Command | Chars | VAR | |
| INPUT | 1 | SubCommand | Hexadecimal VAR Code | B0 | commit parameters to memory |
| OUTPUT | 0 | Command | Chars | VAR | |
| OUTPUT | 1 | SubCommand | Hexadecimal VAR Code | B0 | |
| OUTPUT | 2 | Success | Boolean Number | 0 | This will be "0" on success, or greater than zero for an error if there was a problem commiting |

| CMD_VAR_GET_PARAMETER: | Index | Name | Type | Example | Notes |
| - | - | - | - | - | - |
| INPUT | 0 | Command | Chars | VAR | |
| INPUT | 1 | SubCommand | Hexadecimal VAR Code | B1 | get parameter value |
| INPUT | 2 | Parameter Code | Hexadecimal Parameter Code | 2E | |
| OUTPUT | 0 | Command | Chars | VAR | |
| OUTPUT | 1 | SubCommand | Hexadecimal VAR Code | B1 | |
| OUTPUT | 2 | Parameter Code | Hexadecimal Parameter Code | 2E | |
| OUTPUT | 3 | Data Out | Decimal Number | 38 | |
| OUTPUT | 4 | Success | Boolean Number | 0 | This will be "0" on success, or greater than zero for an error if the VAR Code or Parameter Code doesn't exist |

| CMD_VAR_SET_PARAMETER: | Index | Name | Type | Example | Notes |
| - | - | - | - | - | - |
| INPUT | 0 | Command | Chars | VAR | |
| INPUT | 1 | SubCommand | Hexadecimal VAR Code | B2 | set parameter value |
| INPUT | 2 | Parameter Code | Hexadecimal Parameter Code | 2E | |
| INPUT | 3 | Data In | Decimal Number | 46 | |
| OUTPUT | 0 | Command | Chars | VAR | |
| OUTPUT | 1 | SubCommand | Hexadecimal VAR Code | B2 | |
| OUTPUT | 2 | Parameter Code | Hexadecimal Parameter Code | 2E | |
| OUTPUT | 3 | Data Out | Decimal Number | 46 | will be a "00" (double zero) if the VAR Code or Parameter Code doesn't exist or the input value is out of range |
| OUTPUT | 4 | Success | Boolean Number | 0 | This will be "0" on success, or greater than zero for an error if there was a problem |

| CMD_VAR_GET_KEYMAP: | Index | Name | Type | Example | Notes |
| - | - | - | - | - | - |
| INPUT | 0 | Command | Chars | VAR | |
| INPUT | 1 | SubCommand | Hexadecimal VAR Code | B3 | get keymap parameter value |
| INPUT | 2 | Keymap | Hexadecimal Keymap Code | A0 | |
| INPUT | 3 | Index | Decimal Number | 24 | For CC1, 0-89 are valid. For CCL, 0-66 are valid. |
| OUTPUT | 0 | Command | Chars | VAR | |
| OUTPUT | 1 | SubCommand | Hexadecimal VAR Code | B3 | |
| OUTPUT | 2 | Keymap | Hexadecimal Keymap Code | A0 | |
| OUTPUT | 3 | Index | Decimal Number | 24 | |
| OUTPUT | 4 | Action Id | Decimal Number | 111 | Valid action Ids range from 8 thru 2047. |
| OUTPUT | 5 | Success | Boolean Number | 0 | This will be "0" on success, or greater than zero for an error if either the Keymap Code or Index are out of range. |

| CMD_VAR_SET_KEYMAP: | Index | Name | Type | Example | Notes |
| - | - | - | - | - | - |
| INPUT | 0 | Command | Chars | VAR | |
| INPUT | 1 | SubCommand | Hexadecimal VAR Code | B4 | set keymap parameter value |
| INPUT | 2 | Keymap | Hexadecimal Keymap Code | A0 | |
| INPUT | 3 | Index | Decimal Number | 24 | For CC1, 0-89 are valid. For CCL, 0-66 are 
| INPUT | 4 | Action Id | Decimal Number | 112 | Valid action Ids range from 8 thru 2047. |
| OUTPUT | 0 | Command | Chars | VAR | |
| OUTPUT | 1 | SubCommand | Hexadecimal VAR Code | B3 | |
| OUTPUT | 2 | Keymap | Hexadecimal Keymap Code | A0 | |
| OUTPUT | 3 | Index | Decimal Number | 24 | |
| OUTPUT | 4 | Action Id | Decimal Number | 112 | Valid action Ids range from 8 thru 2047. Returns a "00" if either the Keymap Code or Index or Action Id are out of range. |
| OUTPUT | 5 | Success | Boolean Number | 1 | This will be "0" on success, or greater than zero for an error if the chordmap did not exist or the deletion was unsuccessful |



Example(s):
| CMD_VAR_COMMIT: | Message | Notes |
| - | - | - |
| INPUT | VAR B0 | |
| OUTPUT | VAR B0 1 | |

| CMD_VAR_GET_PARAMETER: | Message | Notes |
| - | - | - |
| INPUT | VAR B1 2E | |
| OUTPUT | VAR B1 2E 38 0 | |

| CMD_VAR_SET_PARAMETER: | Message | Notes |
| - | - | - |
| INPUT | VAR B2 2E 46 | |
| OUTPUT | VAR B2 2E 46 0 | |

| CMD_VAR_GET_KEYMAP: | Message | Notes |
| - | - | - |
| INPUT | VAR B3 A0 24 | |
| OUTPUT | VAR B3 A0 24 111 0 | |

| CMD_VAR_SET_KEYMAP: | Message | Notes |
| - | - | - |
| INPUT | VAR B2 A0 24 112 | |
| OUTPUT | VAR B2 A0 24 112 0 | |




________________________________
### RST
The RST command restart the CharaChorder device. This will most likely also break the current Serial connection, and a new connection will need to be made. If the COMMIT command has not been called before a RESTART command, then the device will revert to the last settings stored in the non-volatile memory.
- The RESTART subcommand restarts the microcontroller.
- The FACTORY subcommand performs a factory reset of the flash and emulated eeprom. During the process, the flash chip is erased.
- The BOOTLOADER subcommand restarts the device into a bootloader mode.
- The PARAMS subcommand resets the parameters to factory defaults and commits.
- The KEYMAPS subcommand resets the keymaps to the factory defaults and commits.
- The STARTER subcommand adds starter chordmaps. This does not clear the chordmap library, but adds to it, replacing those that have the same chord.
- The CLEARCML subcommand permanently deletes all the chordmaps stored in the device memory.
- (in progress) The UPGRADECML subcommand attemps to upgrade chordmaps that the system detects are older.

| I/O | Index | Name | Type | Example | Notes |
| - | - | - | - | - | - |
| INPUT | 0 | Command | Chars | RST | |
| OUTPUT | 0 | Command | Chars | RST | without optional command, this just restarts the device |
| OUTPUT | 1 | Option | Chars | BOOTLOADER | BOOTLOADER (resets to bootloader) or FACTORY (factory reset chordmap library and parameters) |

Example(s):
| I/O | Message |
| - | - |
| RESTART: | - |
| INPUT | RST |
| OUTPUT | RST |
| BOOTLOADER: | - |
| INPUT | RST BOOTLOADER |
| OUTPUT | RST BOOTLOADER |
| FACTORY: | - |
| INPUT | RST STARTER |
| OUTPUT | RST STARTER |

```python
ser.write(b'RST BOOTLOADER\r\n');
```



________________________________
### RAM
The RAM command returns the current number of bytes availabe in SRAM. This is useful for debugging when there is a suspected heap or stack issue.

| I/O | Index | Name | Type | Example | Notes |
| - | - | - | - | - | - |
| INPUT | 0 | Command | Chars | RAM | |
| OUTPUT | 0 | Command | Chars | RAM |  |
| OUTPUT | 1 | Bytes Available | Decimal | 425 | |

Example(s):
| I/O | Message |
| - | - |
| INPUT | RAM |
| OUTPUT | RAM 425 |

```python
ser.write(b'RAM\r\n');
```



________________________________
### SIM
The The SIM command provides a way to inject a chord or key states to be processed by the device. This is primarily used for debugging.

| I/O | Index | Name | Type | Example | Notes |
| - | - | - | - | - | - |
| INPUT | 0 | Command | Chars | SIM | |
| INPUT | 1 | SubCommand | Chars | CHORD | CHORD or KEYSTATE; may change this to hexadecimal codes |
| INPUT | 2 | Data In | Hexadecimal Number | 000000000000C1AE46DED6731EC20F2A | chords should be 32 characters |
| OUTPUT | 0 | Command | Chars | SIM |  |
| OUTPUT | 1 | SubCommand | Chars | CHORD | |
| OUTPUT | 2 | Data In | Hexadecimal Number | 000000000000C1AE46DED6731EC20F2A | |
| OUTPUT | 3 | Data Out | Hexadecimal CCActionCodes List | 6361727065206469656D | "carpe diem" |


Example(s):
| I/O | Message | Notes |
| - | - | - |
| INPUT | SIM CHORD 000000000000C1AE46DED6731EC20F2A | |
| OUTPUT | SIM CHORD 000000000000C1AE46DED6731EC20F2A 6361727065206469656D | |
| - | - | - |
| INPUT | SIM CHORD 00000000E4E2B0160F84B20ACE7638C0 | |
| OUTPUT | SIM CHORD 00000000E4E2B0160F84B20ACE7638C0 0 | returns a 0 if there's no chordmap in the library |

```python
ser.write(b'SIM CHORD 000000000000C1AE46DED6731EC20F2A\r\n');
```




________________________________
















________________________________
________________________________
________________________________
________________________________
________________________________
________________________________

# Trash below here





### SELECT \<dictionary\>
The SELECT changes the current dictionary context. If it is able to select the specified dictionary, it returns the size of the keys in the dictionary. If there is no dictionary, then it returns a value of `-1`.

| Element | Name | Type | Encoding | Example Raw | Example Encoded |
| - | - | - | - | - | - |
| param 1 | dictionary | char array | ASCII/UTF-8 | BASE | "BASE" |
| return | value | 16-bit signed integer | ASCII/UTF-8 Decimal String | 27 | "27" |

```python
ser.write(b'SELECT CONFIG\r\n');
ser.write(b'SELECT ALPHA\r\n');
ser.write(b'SELECT NUMS\r\n');
ser.write(b'SELECT BASE\r\n');
```


### COUNT
The COUNT command returns the size of the keys in the currently selected dictionary.

| Element | Name | Type | Encoding | Example Raw | Example Encoded |
| - | - | - | - | - | - |
| return | value | 16-bit signed integer | ASCII/UTF-8 Decimal String | 27 | "27" |

```python
ser.write(b'SELECT BASE\r\n');
ser.write(b'COUNT\r\n');
ser.write(b'SELECT ALPHA\r\n');
ser.write(b'COUNT\r\n');
```


### KEYS
The KEYS command returns a list of all of the keys within the current dictionary context. If there is no entry in the dictionary, then there is a return of `*-1*`. The outputs will always be in hexadecimal encoding followed by a new line character. Once you have collected the list of keys, you can then call the GET commands to retrieve the value stored for each key. Alternatively you can just call the GETALL command to get both the keys and the values all at once.

| Element | Name | Type | Encoding | Example Raw | Example Encoded |
| - | - | - | - | - | - |
| return | value | byte array | ASCII/UTF-8 Hexadecimal string | "progress" | "70726f6772657373" |

```python
ser.write(b'SELECT BASE\r\n');
ser.write(b'KEYS\r\n');
ser.write(b'SELECT ALPHA\r\n');
ser.write(b'KEYS\r\n');
```


### GET \<key\>
The GET command returns the value stored in the provided key within the current dictionary context. If there is no entry in the dictionary, then there is a return of `*-1*`. The ALPHA, NUMS, and CONFIG dictionaries used an unsiged 8-bit byte for the key. The outputs for the CONFIG dictionary will vary based on the config variable. The outputs will always be in hexadecimal encoding.

| Element | Name | Type | Encoding | Example Raw | Example Encoded |
| - | - | - | - | - | - |
| param 1 | key | unsigned long long | ASCII/UTF-8 Hexadecimal string | 310000050000100700 | "044D57672C9BFD40" |
| return | value | byte array | ASCII/UTF-8 Hexadecimal string | 310000050000100700 "progress" | "044D57672C9BFD40 70726f6772657373" |

```python
ser.write(b'SELECT BASE\r\n');
ser.write(b'GET 044D57672C9BFD40\r\n');
ser.write(b'SELECT ALPHA\r\n');
ser.write(b'GET 1A\r\n'); #26
ser.write(b'GET 34\r\n'); #52
```


### GETALL
The GETALL command returns both the key and the values for all the entries stored within the current dictionary context. Each output line will have the key and the value in hexadecimal encoding. Each dictionary has a different expectation for the length of keys and values.

| Element | Name | Type | Encoding | Example Raw | Example Encoded |
| - | - | - | - | - | - |
| return | value | byte array | ASCII/UTF-8 Hexadecimal string | 310000050000100700 "progress" | "044D57672C9BFD40 70726f6772657373" |

```python
ser.write(b'SELECT BASE\r\n');
ser.write(b'GETALL\r\n');
ser.write(b'SELECT ALPHA\r\n');
ser.write(b'GETALL\r\n');
```


### GETSOME \<start index\> \<end index\>
Note that this method is not yet complete.
The GETSOME command returns the key and values for the entries stored within the current dictionary context that fall within the start index and the end index number values (not inclusive). If either of the indices is invalid or falls outside the range of valid index values, or if the start and end indices are out of order, then there is a return of `*-1*`. This command is primarily design for the BASE dictionary, and not for the ALPHA, NUMS, or CONFIG dictionaries. This command can be used in combination with the COUNT command to retrieve sections of the BASE dictionary.

| Element | Name | Type | Encoding | Example Raw | Example Encoded |
| - | - | - | - | - | - |
| param 1 | start index | unsigned integer | ASCII/UTF-8 Base-10 Decimal string | 10 | "10" |
| param 2 | end index | unsigned integer | ASCII/UTF-8 Base-10 Decimal string | 40 | "40" |
| return | value | byte array | ASCII/UTF-8 Hexadecimal string | "progress" | "70726f6772657373" |

```python
ser.write(b'SELECT BASE\r\n');
ser.write(b'GETSOME 0 10\r\n');
```


### SET \<key\> \<value\>
The SET command sets the value of the provided key within the current dictionary context. If the key already exists, then the new value will overwrite the existing value stored in memory. If the key does not exist (not valid for ALPHA, NUMS, or CONFIG), and the dictionary is dynamic (e.g. BASE), the a new key value pair entry is created in memory. These changes will not be persistent until a COMMIT command is called. Currently the hardware has a relatively small limit to store dynamic key value pairs for chords. Try to limit usage to 500 entries until newer hardware is available with much more onboard non-volatile memory.

| Element | Name | Type | Encoding | Example Raw | Example Encoded |
| - | - | - | - | - | - |
| param 1 | key | unsigned long long | ASCII/UTF-8 Hexadecimal string | 310000050000100700 | "044D57672C9BFD40" |
| param 2 | value | byte array | ASCII/UTF-8 Hexadecimal string | "progress" | "70726f6772657373" |

```python
ser.write(b'SELECT BASE\r\n');
ser.write(b'SET 044D57672C9BFD40 70726f6772657373\r\n');
ser.write(b'SELECT ALPHA\r\n');
ser.write(b'SET 1A 0073\r\n'); #00 denotes ASCII an value, and the 00 is not strictly required for SET
ser.write(b'SET 34 0140\r\n'); #01 denotes a CC Function Code, and the 01 is required
```


### DEL \<key\>
The DEL command removes the key-value of the entry with the provided key within the current dictionary context. This only works for dynamic dictionaries such as BASE. This command is not relevant for ALPHA, NUMS, or CONFIG.

| Element | Name | Type | Encoding | Example Raw | Example Encoded |
| - | - | - | - | - | - |
| param 1 | key | unsigned long long | ASCII/UTF-8 Hexadecimal string | 310000050000100700 | "044D57672C9BFD40" |

```python
ser.write(b'SELECT BASE\r\n');
ser.write(b'DEL 044D57672C9BFD40\r\n');
```


### COMMIT
The COMMIT command saves the config, alpha, and nums dictionaries to the emulated eeprom. The base dictionary is not affected.

| Element | Name | Type | Encoding | Example Raw | Example Encoded |
| - | - | - | - | - | - |
| return | value | utf-8 char byte | number char | "1" | "1" |

```python
ser.write(b'COMMIT\r\n');
```


### CLEAR
The CLEAR command deletes the dynamic chordmap dictionary and sets the count to zero.

| Element | Name | Type | Encoding | Example Raw | Example Encoded |
| - | - | - | - | - | - |
| | | | | | |

```python
ser.write(b'CLEAR\r\n');
```






### CONTEXT \<software\>
The CONTEXT command allows the computer system to inform the CharaChorder of the software that is currently in focus. In later versions, this will allow the CharaChorder to dynamically switch or append additional chords for that particular software.

| Element | Name | Type | Encoding | Example Raw | Example Encoded |
| - | - | - | - | - | - |
| param 1 | software | char array | ASCII/UTF-8 | "PHOTOSHOP" | "PHOTOSHOP" |

```python
ser.write(b'CONTEXT PHOTOSHOP\r\n');
ser.write(b'CONTEXT MAYA\r\n');
ser.write(b'CONTEXT EXCEL\r\n');
```





## Dictionaries
| Dev Status | Dictionary | Description |
| - | - | - |
| available | BASE | typically individual words or phrases mapped to chords |
| available | ALPHA | alphabetical letters mapped to **notes** |
| available | NUMS | numbers mapped to **notes** |
| available | CONFIG | configuration values (see Config Variables) |
| planned | SPECIAL | special predefined mode switching chords (tbd) |
| planned | MOD | modifier chords (tbd) |
| planned | SPUR | special mode for spurred chords (tbd) |
| planned | LONG | extra long mapped values (eg. sentences) (tbd) |


### BASE dictionary
The BASE dictionary is intended to contain the majority of dynamically definable chords that map to words as outputs. Due to current memory constraints in the latest device version (E1), there is a limit of 500 average sized words. Most of the current chord mapped words in the device are hard coded in flash memory until newer hardware (F1) is available. The key for each BASE dictionary entry is a 64-bit integer, represented in the Serial API as a 16 digit hexadecimal string. The values for each BASE dictionary entry can be any sequence of bytes, typically representing printable ASCII values including spaces, tabs, and punctuation. These are represented in the Serial API as a hexadecimal string with an even number of digits. The following entries are preloaded into the base dictionary:


### ALPHA dictionary
The ALPHA dictionary contains 90 key value pairs mapping to the 90 possible notes on the CharaChorder. Since the keys are less than 255, each is represented as a single byte, and in the Serial API is represented by a 2 digit hexadecimal string. The values are 2 bytes, and are represented in the Serial API by a 4 digit hexadecimal string. For ASCII values, the first byte should be 0x00, and will effectively be ignored by the device. If the value in the key value pair is supposed to be a CC Function Code, then the first byte should be 0x01. The following are the default values loaded into the device:

| byteId (DEC)| byteId (HEX) | Description | value (ASCII) | value (HEX) |
| - | - | - | - | - |
|	01	|	01	|Mouse Right Button Press-and-Release||0x13E|
|	02	|	02	|Escape||0x001B|
|	03	|	03	|Right GUI Key||0x187|
|	04	|	04	||-||
|	05	|	05	||||
|	06	|	06	||b||
|	07	|	07	||q||
|	08	|	08	|Previous||0x0115|
|	09	|	09	||x||
|	10	|	0A	||||
|	11	|	0B	||f||
|	12	|	0C	||d||
|	13	|	0D	||h||
|	14	|	0E	||p||
|	15	|	0F	||||
|	16	|	10	|Right Ambi-Throw||0x0111|
|	17	|	11	|Right Num-Shift||0x0113|
|	18	|	12	|Right Alt Key||0x0186|
|	19	|	13	|Right Shift Key||0x0185|
|	20	|	14	||||
|	21	|	15	|Mouse Scroll Coast Down||0x014D|
|	22	|	16	||=||
|	23	|	17	|Mouse Scroll Coast Up||0x014F|
|	24	|	18	|Caps Lock Toggle||0x0188|
|	25	|	19	||||
|	26	|	1A	||s||
|	27	|	1B	||?||
|	28	|	1C	|Right Contro Keyl||0x0184|
|	29	|	1D	||y||
|	30	|	1E	||||
|	31	|	1F	|Down Arrow||0x01A0|
|	32	|	20	|Right Arrow||0x019E|
|	33	|	21	|Up Arrow||0x01A1|
|	34	|	22	|Left Arrow||0x019F|
|	35	|	23	||||
|	36	|	24	||n||
|	37	|	25	||j||
|	38	|	26	|Tab||0x0009|
|	39	|	27	|Letter L|l||
|	40	|	28	||||
|	41	|	29	||t||
|	42	|	2A	|Space| ||
|	43	|	2B	|Enter (LF)||0x000A|
|	44	|	2C	||a||
|	45	|	2D	||||
|	47	|	2F	||-||
|	46	|	2E	|Mouse Middle Button Press-and-Release||0x013F|
|	48	|	30	|Left GUI Key||0x0183|
|	49	|	31	|Escape||0x001B|
|	50	|	32	||||
|	51	|	33	||w||
|	52	|	34	|Mouse Left Button Press-and-Release||0x013D|
|	53	|	35	||g||
|	54	|	36	||z||
|	55	|	37	||||
|	56	|	38	||k||
|	57	|	39	||v||
|	58	|	3A	||m||
|	59	|	3B	||c||
|	60	|	3C	||||
|	61	|	3D	|Left Ambi-Throw||0x0110|
|	62	|	3E	|Left Shift Key||0x181|
|	63	|	3F	|Left Alt Key||0x182|
|	64	|	40	|Left Num-Shift||0x0112|
|	65	|	41	||||
|	66	|	42	|Mouse Scroll Coast Down||0x014D|
|	67	|	43	||/||
|	68	|	44	|Mouse Scroll Coast Up||0x014F|
|	69	|	45	||\||
|	70	|	46	||||
|	71	|	47	||u||
|	72	|	48	|Single Quote|'||
|	73	|	49	|Left Control Key||0x0180|
|	74	|	4A	||,||
|	75	|	4B	||||
|	76	|	4C	|Down Arrow||0x01A0|
|	77	|	4D	|Right Arrow||0x019E|
|	78	|	4E	|Up Arrow||0x01A1|
|	79	|	4F	|Left Arrow||0x019F|
|	80	|	50	||||
|	81	|	51	||o||
|	82	|	52	||i||
|	83	|	53	|Delete (forward) ||0x007F|
|	84	|	54	||.||
|	85	|	55	||||
|	86	|	56	||e||
|	87	|	57	||r||
|	88	|	58	|Backspace||0x0008|
|	89	|	59	|Space| ||
|	90	|	5A	||||


### NUMS dictionary
The NUMS dictionary has the same structure as the ALPHA dictionary, but represents the layout when the Number Toggle is activated. This dictionary primarily contains numberical and mathematical outputs. The following are the default values loaded into the device:

| byteId (DEC)| byteId (HEX) | Description | value (ASCII) | value (HEX) |
| - | - | - | - | - |
|	01	|	01	||||
|	02	|	02	||||
|	03	|	03	|Right GUI Key||0x0187|
|	04	|	04	||||
|	05	|	05	||||
|	06	|	06	||||
|	07	|	07	||]||
|	08	|	08	||[||
|	09	|	09	||||
|	10	|	0A	||||
|	11	|	0B	||7||
|	12	|	0C	||0||
|	13	|	0D	||9||
|	14	|	0E	||8||
|	15	|	0F	||||
|	16	|	10	||||
|	17	|	11	||||
|	18	|	12	|Right Alt Key||0x0186|
|	19	|	13	|Right Shift Key||0x0185|
|	20	|	14	||||
|	21	|	15	|Mouse Move Down||0x0149|
|	22	|	16	|Mouse Move Right||0x014A|
|	23	|	17	|Mouse Move Up||0x014B|
|	24	|	18	|Mouse Move Left||0x014C|
|	25	|	19	||||
|	26	|	1A	||||
|	27	|	1B	||?||
|	28	|	1C	|Right Control Key||0x0184|
|	29	|	1D	||||
|	30	|	1E	||||
|	31	|	1F	|Down Arrow||0x01A0|
|	32	|	20	|Right Arrow||0x019E|
|	33	|	21	|Up Arrow||0x01A1|
|	34	|	22	|Left Arrow||0x019F|
|	35	|	23	||||
|	36	|	24	||5||
|	37	|	25	||6||
|	38	|	26	|Tab||0x0009|
|	39	|	27	||4||
|	40	|	28	||||
|	41	|	29	||2||
|	42	|	2A	||3||
|	43	|	2B	|Enter (LF)||0x000A|
|	44	|	2C	||1||
|	45	|	2D	||||
|	46	|	2E	||||
|	47	|	2F	||||
|	48	|	30	||||
|	49	|	31	|Left GUI Key||0x0183|
|	50	|	32	||||
|	51	|	33	||||
|	52	|	34	||||
|	53	|	35	||[||
|	54	|	36	||]||
|	55	|	37	||||
|	56	|	38	||7||
|	57	|	39	||8||
|	58	|	3A	||9||
|	59	|	3B	||0||
|	60	|	3C	||||
|	61	|	3D	||||
|	62	|	3E	|Left Shift Key||0x0181|
|	63	|	3F	|Left Alt Key||0x0182|
|	64	|	40	||||
|	65	|	41	||||
|	66	|	42	|Mouse Move Down||0x0149|
|	67	|	43	|Mouse Move Right||0x014A|
|	68	|	44	|Mouse Move Up||0x014B|
|	69	|	45	|Mouse Move Left||0x014C|
|	70	|	46	||||
|	71	|	47	||||
|	72	|	48	|Single Quote|'||
|	73	|	49	|Left Control Key||0x0180|
|	74	|	4A	||,||
|	75	|	4B	||||
|	76	|	4C	|Down Arrow||0x01A0|
|	77	|	4D	|Right Arrow||0x019E|
|	79	|	4F	|Left Arrow||0x019F|
|	78	|	4E	|Up Arrow||0x01A1|
|	80	|	50	||||
|	81	|	51	||5||
|	82	|	52	||4||
|	83	|	53	|Delete (forward)||0x007F|
|	84	|	54	||6||
|	85	|	55	||||
|	86	|	56	||2||
|	87	|	57	||1||
|	88	|	58	|Backspace||0x0008|
|	89	|	59	||3||
|	90	|	5A	||||


### CONFIG dictionary
The CONFIG dictionary contains a list of configuration variables. The keys are all a single byte, represented in the Serial API by a 2 digit hexadecimal string. The values in the key value pair are primarily single bytes, but some are more bytes. See the Config Variables section for details on these values. The CharaChorder will parse the hexadecimal string values in the case of single byte values, appending additional 00 strings to the front of the hexadecimal string. See the Config Variables section for default values preloaded into the device.


## Config Variables
Configuration Variables consist of the variables that can be modified to change the performance or messaging of the CharaChorder. Some of the variables enable and disable features, while others control time and count thresholds.

| byteId (DEC)| byteId (HEX) | Variable | Description | Type | Range | Default Value | Default Encoded Value |
| - | - | - | - | - | - | - | - |
| 00 | 0x00 | reserved |  |  |  |  |  |
| 01 | 0x01 | enable Serial UART LOG | enables/disables Serial UART output of LOG message | Boolean | 0-1 | False | 0x00 |
| 02 | 0x02 | enable Serial UART RAW | enables/disables Serial UART output of RAW keywise values before/at chord detection in HEX format | Boolean | 0-1 | False | 0x00 |
| 03 | 0x03 | enable Serial UART CHORD | enables/disables Serial UART output of CHORD keywise values at the time of chord detection in HEX format | Boolean | 0-1 | False | 0x00 |
| 04 | 0x04 | enable Serial UART KEYBOARD | enables/disables Serial UART output of utf-8 keyboard characters and command bytes in HEX format | Boolean | 0-1 | False | 0x00 |
| 05 | 0x05 | enable Serial UART MOUSE | enables/disables Serial UART output of mouse movements and clicks as string messages (format TBD) | Boolean | 0-1 | False | 0x00 |
| 06 | 0x06 | enable Serial UART DEBUG | enables/disables Serial UART output of mouse movements and clicks as string messages (format TBD) | Boolean | 0-1 | False | 0x00 |
| 07 | 0x07 | enable Serial UART HEADER | enables/disables Serial UART output of Header flags in front of all of the Serial UART outputs | Boolean | 0-1 | False | 0x00 |
| 10 | 0x0A | enableKeyboardHID | enables/disables HID keyboard output | Boolean | 0-1 | True | 0x01 |
| 11 | 0x0B | pressThreshold |  | Integer | 0-255 | 18 | 0x12 |
| 12 | 0x0C | releaseThreshold |  | Integer | 0-255 | 18 | 0x12 |
| 20 | 0x14 | enableMouseHID | enables/disables HID mouse output | Boolean | 0-1 | True | 0x01 |
| 21 | 0x15 | scrollDelay |  | Integer | 0-255 | 100 | 0x64 |
| 30 | 0x1E | enableSpurring |  | Boolean | 0-1 | True | 0x01 |
| 31 | 0x1F | spurKillerToggle |  | Boolean | 0-1 | True | 0x01 |
| 32 | 0x20 | spurKiller |  | Integer | 0-32767 | 10000 | 0x2710 |
| 40 | 0x28 | enableChording |  | boolean | 0-1 | True | 0x01 |
| 41 | 0x29 | charKillerToggle |  | boolean | 0-1 | True | 0x01 |
| 42 | 0x2A | charCounterKiller |  | Integer | 0-32767 | 100 | 0x64 |

**Example Serial Messages for setting CONFIG Variables**
```
SELECT CONFIG
SET 01 00
SET 02 00
SET 03 00
SET 04 00
SET 05 00
SET 06 00
SET 07 00
SET 0A 01
SET 0B 12
SET 0C 12
SET 14 01
SET 15 64
SET 1E 01
SET 1F 01
SET 20 2710
SET 28 01
SET 29 01
SET 2A 64
```

## Special Messages
Special messages can be sent over serial for communicating with the software. Currently there is only 1 described below.

| Message | Description |
| - | - |
| "IMPULSE" | output from the Serial UART when the impulse popup should be opened by the software. |


## CC Function Codes
CC Function Codes are used when stored along with a preceding 0x01 byte, which in ASCII has no printable value.

| MVP | BYTE (DEC) | BYTE (HEX) | Description |
| - | - | - | - |
|    |	00  | 00 | Reset Controller	|
|    |	01  | 01 | Delay 1ms	|
|    |	02  | 02 | Delay 10ms	|
|    |	03  | 03 | Delay 100ms	|
|    |	04  | 04 | Delay 1000ms	|
|true|  15  | 0F | Impulse |
|true|  16  | 10 | Left AmbiThrow |
|true|  17  | 11 | Right AmbiThrow |
|true|  18  | 12 | Left Num-Shift |
|true|  20  | 14 | Right Num-Shift |
|true|  19  | 13 | Spur Toggle |
|true|  21  | 15 | Repeat Last Note |
|true|  22  | 16 | Internal Firmware Based Impulse Toggle |
|true|  61  | 3D | Mouse Left Button Press-and-Release |
|true|  62  | 3E | Mouse Right Button Press-and-Release | |
|true|  63  | 3F | Mouse Middle Button Press-and-Release |
|true|  64  | 40 | Mouse Left Button Toggle |
|true|  65  | 41 | Mouse Right Button Toggle |
|true|  66  | 42 | Mouse Middle Button Toggle |
|true|  67  | 43 | Mouse Left Button Press |
|true|  68  | 44 | Mouse Right Button Press |
|true|  69  | 45 | Mouse Middle Button Press |
|true|  70  | 46 | Mouse Left Button Release |
|true|  71  | 47 | Mouse Right Button Release |
|true|  72  | 48 | Mouse Middle Button Release |
|true|  73  | 49 | Mouse Move Down |
|true|  74  | 4A | Mouse Move Right |
|true|  75  | 4B | Mouse Move Up |
|true|  76  | 4C | Mouse Move Left |
|true|  77  | 4D | Mouse Scroll Coast Down |
|true|  78  | 4E | Mouse Scroll Coast Right |
|true|  79  | 4F | Mouse Scroll Coast Up |
|true|  80  | 50 | Mouse Scroll Coast Left |
|| 102 | 66 | Power Key |
|true| 127 | F7 | Release All Modifier Keys |
|true| 128 | 80 | Left Control Key |
|true| 129 | 81 | Left Shift Key |
|true| 130 | 82 | Left Alt Key |
|true| 131 | 83 | Left GUI Key |
|true| 132 | 84 | Right Control Key |
|true| 133 | 85 | Right Shift Key |
|true| 134 | 86 | Right Alt Key |
|true| 135 | 87 | Right GUI Key |
|true| 136 | 88 | Caps Lock Toggle |
|true| 137 | 89 | F1 |
|true| 138 | 8A | F2 |
|true| 139 | 8B | F3 |
|true| 140 | 8C | F4 |
|true| 141 | 8D | F5 |
|true| 142 | 8E | F6 |
|true| 143 | 8F | F7 |
|true| 145 | 91 | F9 |
|true| 144 | 90 | F8 |
|true| 146 | 92 | F10 |
|true| 147 | 93 | F11 |
|true| 148 | 94 | F12 |
|| 149 | 95 | Print Screen |
|| 150 | 96 | Scroll Lock Toggle |
|| 151 | 97 | Pause |
|| 152 | 98 | Insert |
|| 153 | 99 | Home |
|| 154 | 9A | Page Up |
|| 155 | 9B | Delete Forward |
|| 156 | 9C | End |
|| 157 | 9D | Page Down |
|true| 158 | 9E | Right Arrow |
|true| 159 | 9F | Left Arrow |
|true| 160 | A0 | Down Arrow |
|true| 161 | A1 | Up Arrow |
|| 162 | A2 | Num Lock Toggle |
|| 163 | A3 | F13 |
|| 164 | A4 | F14 |
|| 165 | A5 | F15 |
|| 166 | A6 | F16 |
|| 167 | A7 | F17 |
|| 168 | A8 | F18 |
|| 169 | A9 | F19 |
|| 170 | AA | F20 |
|| 171 | AB | F21 |
|| 172 | AC | F22 |
|| 173 | AD | F23 |
|| 174 | AE | F24 |
|| 175 | AF | Execute |
|| 176 | B0 | Help |
|| 177 | B1 | Menu |
|| 178 | B2 | Select |
|| 179 | B3 | Stop |
|| 180 | B4 | Again |
|true| 181 | B5 | Undo |
|true| 182 | B6 | Cut |
|true| 183 | B7 | Copy |
|true| 184 | B8 | Paste |
|| 185 | B9 | Find |
|| 186 | BA | Mute |
|true| 187 | BB | Volume Up |
|true| 188 | BC | Volume Down |
|true| 189 | BD | International1 |
|true| 190 | BE | International2 |
|true| 191 | BF | International3 |
|true| 192 | C0 | International4 |
|true| 193 | C1 | International5 |
|true| 194 | C2 | International6 |
|true| 195 | C3 | International7 |
|true| 196 | C4 | International8 |
|true| 197 | C5 | International9 |
|true| 198 | C6 | LANG1 |
|true| 199 | C7 | LANG2 |
|true| 200 | C8 | LANG3 |
|true| 201 | C9 | LANG4 |
|true| 202 | CA | LANG5 |
|true| 203 | CB | LANG6 |
|true| 204 | CC | LANG7 |
|true| 205 | CD | LANG8 |
|true| 206 | CE | LANG9 |
|| 207 | CF | Alternate Erase |
|| 208 | D0 | SysReq/Attention |
|| 209 | D1 | Cancel |
|| 210 | D2 | Clear |
|| 211 | D3 | Prior |
|| 212 | D4 | Return |
|| 213 | D5 | Separator |
|| 214 | D6 | Out |
|| 215 | D7 | Oper |
|| 216 | D8 | Clear/Again |
|| 217 | D9 | CrSel/Props |
|| 218 | DA | ExSel |
|| 219 | DB | Thousands Separator |
|| 220 | DC | Decimal Separator |
|| 221 | DD | Currency Unit |
|| 222 | DE | Currency Sub-unit |
|| 223 | DF | Keypad Memory Store |
|| 224 | E0 | Keypad Memory Recall |
|| 225 | E1 | Keypad Memory Clear |
|| 226 | E2 | Keypad Memory Add |
|| 227 | E3 | Keypad Memory Subtract |
|| 228 | E4 | Keypad Memory Multiply |
|| 229 | E5 | Keypad Memory Divide |
|| 230 | E6 | Keypad +/- |
|| 231 | E7 | Keypad Clear |
|| 232 | E8 | Keypad Clear Entry |
|| 233 | E9 | Keypad Binary |
|| 234 | EA | Keypad Octal |
|| 235 | EB | Keypad Decimal |
|| 236 | EC | Keypad Hexadecimal |
|| 237 | ED | Key Media Play Pause |
|| 238 | EE | Key Media Stop CD |
|| 239 | EF | Key Media Previous Song |
|| 240 | F0 | Key Media Next Song |
|| 241 | F1 | Key Media Eject CD |
|| 242 | F2 | Key Media Volume Up |
|| 243 | F3 | Key Media Volume Down |
|| 244 | F4 | Key Media Mute |
|| 245 | F5 | Key Media WWW |
|| 246 | F6 | Key Media Back |
|| 247 | F7 | Key Media Forward |
|| 248 | F8 | Key Media Stop |
|| 249 | F9 | Key Media Find |
|| 250 | FA | Key Media Scroll Up |
|| 251 | FB | Key Media Scroll Down |
|| 252 | FC | Key Media Edit |
|| 253 | FD | Key Media Sleep |
|| 254 | FE | Key Media Coffee |
|| 255 | FF | Key Media Refresh |


## Notes and NoteIds
A **note** is a chord that represents a single switch in either the pressed or one of the four cardinal directions. The ordinal (diagonal) directions on the 5-way switches are not included in the set of what are considered **notes**. The Charachorder has 90 unique **notes** since there are 5 positions possible on each of 18 switches. A **nodeId** is a 1-byte mapping from 1 to 90 of each of the 90 possible **notes**. The **nodeIds** can be represented and also recognized in its 64-bit integer form. Below is a mapping of the 1-byte **nodeId** form and the 64-bit chord form of all of the possible 90 **notes**. Diagonal switches are even numbers that represent simultaneous activation of two ordinal directions. A 3D key is a number 9 that represents pushing the down on the center of the switch.

| BYTE (DEC) | BYTE (HEX) | Position | CHORD (DEC) | CHORD (SCI) | CHORD (HEX) |
| - | - | - | - | - | - |
|	01	|	01	|	000000000000000001	|RH Thumb 3 Left| 1E00 |	0000000000000001	|
|	02	|	02	|	000000000000000003	|RH Thumb 3 Down| 3E00 |	0000000000000003	|
|	03	|	03	|	000000000000000005	|RH Thumb 3 Right| 5E00 |	0000000000000005	|
|	04	|	04	|	000000000000000007	|RH Thumb 3 Up| 7E00 |	0000000000000007	|
|	05	|	05	|	000000000000000009	|RH Thumb 3 Center| 9E00 |	0000000000000009	|
|	06	|	06	|	000000000000000010	|RH Thumb 2 Left| 1E01 |	000000000000000A	|
|	07	|	07	|	000000000000000030	|RH Thumb 2 Down| 3E01 |	000000000000001E	|
|	08	|	08	|	000000000000000050	|RH Thumb 2 Right| 5E01 |	0000000000000032	|
|	09	|	09	|	000000000000000070	|RH Thumb 2 Up| 7E01 |	0000000000000046	|
|	10	|	0A	|	000000000000000090	|RH Thumb 2 Center| 9E01 |	000000000000005A	|
|	11	|	0B	|	000000000000000100	|RH Thumb 1 Left| 1E02 |	0000000000000064	|
|	12	|	0C	|	000000000000000300	|RH Thumb 1 Down| 3E02 |	000000000000012C	|
|	13	|	0D	|	000000000000000500	|RH Thumb 1 Right| 5E02 |	00000000000001F4	|
|	14	|	0E	|	000000000000000700	|RH Thumb 1 Up| 7E02 |	00000000000002BC	|
|	15	|	0F	|	000000000000000900	|RH Thumb 1 Center| 9E02 |	0000000000000384	|
|	16	|	10	|	000000000000001000	|RH Pinky Down| 1E03 |	00000000000003E8	|
|	17	|	11	|	000000000000003000	|RH Pinky Right| 3E03 |	0000000000000BB8	|
|	18	|	12	|	000000000000005000	|RH Pinky Up| 5E03 |	0000000000001388	|
|	19	|	13	|	000000000000007000	|RH Pinky Left| 7E03 |	0000000000001B58	|
|	20	|	14	|	000000000000009000	|RH Pinky Center| 9E03 |	0000000000002328	|
|	21	|	15	|	000000000000010000	|RH Ring Secondary Down| 1E04 |	0000000000002710	|
|	22	|	16	|	000000000000030000	|RH Ring Secondary Right| 3E04 |	0000000000007530	|
|	23	|	17	|	000000000000050000	|RH Ring Secondary Up| 5E04 |	000000000000C350	|
|	24	|	18	|	000000000000070000	|RH Ring Secondary Left| 7E04 |	0000000000011170	|
|	25	|	19	|	000000000000090000	|RH Ring Secondary Center| 9E04 |	0000000000015F90	|
|	26	|	1A	|	000000000000100000	|RH Ring Primary Down| 1E05 |	00000000000186A0	|
|	27	|	1B	|	000000000000300000	|RH Ring Primary Right| 3E05 |	00000000000493E0	|
|	28	|	1C	|	000000000000500000	|RH Ring Primary Up| 5E05 |	000000000007A120	|
|	29	|	1D	|	000000000000700000	|RH Ring Primary Left| 7E05 |	00000000000AAE60	|
|	30	|	1E	|	000000000000900000	|RH Ring Primary Center| 9E05 |	00000000000DBBA0	|
|	31	|	1F	|	000000000001000000	|RH Middle Secondary Down| 1E06 |	00000000000F4240	|
|	32	|	20	|	000000000003000000	|RH Middle Secondary Right| 3E06 |	00000000002DC6C0	|
|	33	|	21	|	000000000005000000	|RH Middle Secondary Up| 5E06 |	00000000004C4B40	|
|	34	|	22	|	000000000007000000	|RH Middle Secondary Left| 7E06 |	00000000006ACFC0	|
|	35	|	23	|	000000000009000000	|RH Middle Secondary Center| 9E06 |	0000000000895440	|
|	36	|	24	|	000000000010000000	|RH Middle Primary Down| 1E07 |	0000000000989680	|
|	37	|	25	|	000000000030000000	|RH Middle Primary Right| 3E07 |	0000000001C9C380	|
|	38	|	26	|	000000000050000000	|RH Middle Primary Up| 5E07 |	0000000002FAF080	|
|	39	|	27	|	000000000070000000	|RH Middle Primary Left| 7E07 |	00000000042C1D80	|
|	40	|	28	|	000000000090000000	|RH Middle Primary Center| 9E07 |	00000000055D4A80	|
|	41	|	29	|	000000000100000000	|RH Index Down| 1E08 |	0000000005F5E100	|
|	42	|	2A	|	000000000300000000	|RH Index Right| 3E08 |	0000000011E1A300	|
|	43	|	2B	|	000000000500000000	|RH Index Up| 5E08 |	000000001DCD6500	|
|	44	|	2C	|	000000000700000000	|RH Index Left| 7E08 |	0000000029B92700	|
|	45	|	2D	|	000000000900000000	|RH Index Center| 9E08 |	0000000035A4E900	|
|	46	|	2E	|	000000001000000000	|LH Thumb 3 Right| 1E09 |	000000003B9ACA00	|
|	47	|	2F	|	000000003000000000	|LH Thumb 3 Up| 3E09 |	00000000B2D05E00	|
|	48	|	30	|	000000005000000000	|LH Thumb 3 Left| 5E09 |	000000012A05F200	|
|	49	|	31	|	000000007000000000	|LH Thumb 3 Down| 7E09 |	00000001A13B8600	|
|	50	|	32	|	000000009000000000	|LH Thumb 3 Center| 9E09 |	0000000218711A00	|
|	51	|	33	|	000000010000000000	|LH Thumb 2 Right| 1E10 |	00000002540BE400	|
|	52	|	34	|	000000030000000000	|LH Thumb 2 Up| 3E10 |	00000006FC23AC00	|
|	53	|	35	|	000000050000000000	|LH Thumb 2 Left| 5E10 |	0000000BA43B7400	|
|	54	|	36	|	000000070000000000	|LH Thumb 2 Down| 7E10 |	000000104C533C00	|
|	55	|	37	|	000000090000000000	|LH Thumb 2 Center| 9E10 |	00000014F46B0400	|
|	56	|	38	|	000000100000000000	|LH Thumb 1 Right| 1E11 |	000000174876E800	|
|	57	|	39	|	000000300000000000	|LH Thumb 1 Up| 3E11 |	00000045D964B800	|
|	58	|	3A	|	000000500000000000	|LH Thumb 1 Left| 5E11 |	000000746A528800	|
|	59	|	3B	|	000000700000000000	|LH Thumb 1 Down| 7E11 |	000000A2FB405800	|
|	60	|	3C	|	000000900000000000	|LH Thumb 1 Center| 9E11 |	000000D18C2E2800	|
|	61	|	3D	|	000001000000000000	|LH Pinky Down| 1E12 |	000000E8D4A51000	|
|	62	|	3E	|	000003000000000000	|LH Pinky Right| 3E12 |	000002BA7DEF3000	|
|	63	|	3F	|	000005000000000000	|LH Pinky Up| 5E12 |	0000048C27395000	|
|	64	|	40	| 000007000000000000	|LH Pinky Left| 7E12 |	0000065DD0837000	|
|	65	|	41	|	000009000000000000	|LH Pinky Center| 9E12 |	0000082F79CD9000	|
|	66	|	42	|	000010000000000000	|LH Ring Secondary Down| 1E13 |	000009184E72A000	|
|	67	|	43	|	000030000000000000	|LH Ring Secondary Right| 3E13 |	00001B48EB57E000	|
|	68	|	44	|	000050000000000000	|LH Ring Secondary Up| 5E13 |	00002D79883D2000	|
|	69	|	45	|	000070000000000000	|LH Ring Secondary Left| 7E13 |	00003FAA25226000	|
|	70	|	46	|	000090000000000000	|LH Ring Secondary Center| 9E13 |	000051DAC207A000	|
|	71	|	47	|	000100000000000000	|LH Ring Primary Down| 1E14 |	00005AF3107A4000	|
|	72	|	48	|	000300000000000000	|LH Ring Primary Right| 3E14 |	000110D9316EC000	|
|	73	|	49	|	000500000000000000	|LH Ring Primary Up| 5E14 |	0001C6BF52634000	|
|	74	|	4A	|	000700000000000000	|LH Ring Primary Left| 7E14 |	00027CA57357C000	|
|	75	|	4B	|	000900000000000000	|LH Ring Primary Center| 9E14 |	0003328B944C4000	|
|	76	|	4C	|	001000000000000000	|LH Middle Secondary Down| 1E15 |	00038D7EA4C68000	|
|	77	|	4D	|	003000000000000000	|LH Middle Secondary right| 3E15 |	000AA87BEE538000	|
|	78	|	4E	|	005000000000000000	|LH Middle Secondary Up| 5E15 |	0011C37937E08000	|
|	79	|	4F	|	007000000000000000	|LH Middle Secondary Left| 7E15 |	0018DE76816D8000	|
|	80	|	50	|	009000000000000000	|LH Middle Secondary Center| 9E15 |	001FF973CAFA8000	|
|	81	|	51	|	010000000000000000	|LH Middle Primary Down| 1E16 |	002386F26FC10000	|
|	82	|	52	|	030000000000000000	|LH Middle Primary Right| 3E16 |	006A94D74F430000	|
|	83	|	53	|	050000000000000000	|LH Middle Primary Up| 5E16 |	00B1A2BC2EC50000	|
|	84	|	54	|	070000000000000000	|LH Middle Primary Left| 7E16 |	00F8B0A10E470000	|
|	85	|	55	|	090000000000000000	|LH Middle Primary Center| 9E16 |	013FBE85EDC90000	|
|	86	|	56	| 100000000000000000	|LH Index Down| 1E17 |	016345785D8A0000	|
|	87	|	57	|	300000000000000000	|LH Index Right| 3E17 |	0429D069189E0000	|
|	88	|	58	|	500000000000000000	|LH Index Up| 5E17 |	06F05B59D3B20000	|
|	89	|	59	|	700000000000000000	|LH Index Left| 7E17 |	09B6E64A8EC60000	|
|	90	|	5A	|	900000000000000000	|LH Index Center| 9E17 |	0C7D713B49DA0000	|

**Example Conversion Function to/from the 1-byte noteId form from/to 64-bit chord form:**
```python
import math

def noteId_to_chord(note):
    return ((2*((note-1)%5))+1) * (10**(int((note-1)/5)))

def chord_to_noteId(chord):
    return int(5*int(math.log10(chord)) + (int(chord/(10**int(math.log10(chord)))+1)/2))

def main():
    for i in range(1,91): #note_byte can be an integer value of 1 to 90
        note_chord = noteId_to_chord(i)
        note_byte = chord_to_noteId(note_chord)
        print(""+str(i)+" "+str(note_chord)+" "+str(note_byte))

if __name__ == "__main__":
    main()
```
