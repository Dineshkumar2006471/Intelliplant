import os
from fpdf import FPDF

demo_dir = r"c:\Users\bingi\Intelliplant\demo-data"
if not os.path.exists(demo_dir):
    os.makedirs(demo_dir)


def create_pdf(filename, title, content):
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)

    # Title
    pdf.set_font("Arial", "B", 16)
    pdf.cell(200, 10, title, ln=1, align="C")
    pdf.ln(10)

    # Content
    pdf.set_font("Arial", size=12)
    pdf.multi_cell(0, 10, content)

    filepath = os.path.join(demo_dir, filename)
    pdf.output(filepath)
    print(f"Generated {filepath}")


# Text for Factory Act
factory_act_text = """
THE FACTORIES ACT, 1948

Section 21: Fencing of machinery.
(1) In every factory the following, namely:
every moving part of a prime mover and every flywheel connected to a prime mover, whether the prime mover or flywheel is in the engine house or not;
the headrace and tailrace of every water-wheel and water turbine;
any part of a stock-bar which projects beyond the head stock of a lathe; and
unless they are in such position or of such construction as to be safe to every person employed in the factory as they would be if they were securely fenced, the following, namely:
every part of an electric generator, a motor or rotary converter;
every part of transmission machinery; and
every dangerous part of any other machinery;
shall be securely fenced by safeguards of substantial construction which shall be constantly maintained and kept in position while the parts of machinery they are fencing are in motion or in use.

Section 41: Power to make rules to supplement this Chapter.
The State Government may make rules requiring the provision in any factory or in any class or description of factories of such further devices and measures for securing the safety of persons employed therein as it may deem necessary.
"""

# Text for OISD 118
oisd_text = """
OISD-STD-118
LAYOUT FOR OIL AND GAS INSTALLATIONS

1.0 INTRODUCTION
This standard lays down the minimum requirements for layout of facilities at Oil and Gas installations to ensure safety of personnel and property.

4.0 GENERAL LAYOUT PHILOSOPHY
4.1 The layout of an installation shall be planned to minimize the risk of fire, explosion, and toxic release, and to facilitate firefighting and rescue operations.
4.2 Equipment spacing shall be based on the hazard distances, operational requirements, and maintenance access.
4.3 Compressors and pumps handling flammable fluids shall be located in well-ventilated areas.
4.4 High hazard areas shall be segregated from low hazard areas.

5.0 EQUIPMENT SPACING
5.1 Distance between two process units shall not be less than 30 meters.
5.2 Distance between a process unit and a storage tank shall not be less than 60 meters.
5.3 Fire water pumps shall be located at a safe distance from process and storage areas, typically not less than 60 meters.
"""

create_pdf("Factory_Act_1948.pdf", "The Factories Act, 1948", factory_act_text)
create_pdf("OISD_118_Layout.pdf", "OISD-STD-118 Layouts", oisd_text)
